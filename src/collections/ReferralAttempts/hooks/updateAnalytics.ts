import { CollectionAfterChangeHook } from "payload"
import { UAParser } from "ua-parser-js"

type FailureBreakdown = {
  alreadyReferred: number;
  invalidCode: number;
  expiredCode: number;
  other: number;
}

type GeographicData = {
  countries: { [key: string]: number };
  cities: { [key: string]: number };
}

type DeviceData = {
  browsers: { [key: string]: number };
  operatingSystems: { [key: string]: number };
  devices: { [key: string]: number };
}

type TimeData = {
  hourlyDistribution: { [key: number]: number };
  dailyDistribution: { [key: number]: number };
}

export const updateAnalytics: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  const { payload } = req

  // Parse user agent for device data
  const ua = new UAParser(doc.userAgent)
  const browser = ua.getBrowser()
  const os = ua.getOS()
  const device = ua.getDevice()

  // Get current analytics or create new
  const existingAnalytics = await payload.find({
    collection: 'referral-analytics',
    where: {
      referralCode: {
        equals: doc.referralCode,
      },
    },
  })

  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()

  // Prepare update data
  const updateData: any = {
    lastUpdated: now.toISOString(),
    totalAttempts: (existingAnalytics.docs[0]?.totalAttempts || 0) + 1,
  }

  // Update success/failure counts
  if (doc.status === 'success') {
    updateData.successfulAttempts = (existingAnalytics.docs[0]?.successfulAttempts || 0) + 1
  } else if (doc.status === 'failed') {
    updateData.failedAttempts = (existingAnalytics.docs[0]?.failedAttempts || 0) + 1
    
    // Update failure breakdown
    const existingBreakdown = existingAnalytics.docs[0]?.failureBreakdown || {}
    const failureBreakdown: FailureBreakdown = {
      alreadyReferred: Number(existingBreakdown.alreadyReferred) || 0,
      invalidCode: Number(existingBreakdown.invalidCode) || 0,
      expiredCode: Number(existingBreakdown.expiredCode) || 0,
      other: Number(existingBreakdown.other) || 0,
    }
    failureBreakdown[doc.failureReason as keyof FailureBreakdown] = (failureBreakdown[doc.failureReason as keyof FailureBreakdown] || 0) + 1
    updateData.failureBreakdown = failureBreakdown
  }

  // Calculate success rate
  updateData.successRate = (updateData.successfulAttempts / updateData.totalAttempts) * 100

  // Update geographic data
  const geoData: GeographicData = {
    countries: {},
    cities: {},
  }
  const country = 'unknown' // Replace with actual geolocation
  const city = 'unknown' // Replace with actual geolocation
  const existingCountries = (existingAnalytics.docs[0]?.geographicData?.countries as { [key: string]: number }) || {}
  const existingCities = (existingAnalytics.docs[0]?.geographicData?.cities as { [key: string]: number }) || {}
  geoData.countries[country] = (existingCountries[country] || 0) + 1
  geoData.cities[city] = (existingCities[city] || 0) + 1
  updateData.geographicData = geoData

  // Update device data
  const deviceData: DeviceData = {
    browsers: {},
    operatingSystems: {},
    devices: {},
  }
  const existingBrowsers = (existingAnalytics.docs[0]?.deviceData?.browsers as { [key: string]: number }) || {}
  const existingOS = (existingAnalytics.docs[0]?.deviceData?.operatingSystems as { [key: string]: number }) || {}
  const existingDevices = (existingAnalytics.docs[0]?.deviceData?.devices as { [key: string]: number }) || {}
  deviceData.browsers[browser.name || 'unknown'] = (existingBrowsers[browser.name || 'unknown'] || 0) + 1
  deviceData.operatingSystems[os.name || 'unknown'] = (existingOS[os.name || 'unknown'] || 0) + 1
  deviceData.devices[device.type || 'desktop'] = (existingDevices[device.type || 'desktop'] || 0) + 1
  updateData.deviceData = deviceData

  // Update time data
  const timeData: TimeData = {
    hourlyDistribution: {},
    dailyDistribution: {},
  }
  const existingHourly = (existingAnalytics.docs[0]?.timeData?.hourlyDistribution as { [key: number]: number }) || {}
  const existingDaily = (existingAnalytics.docs[0]?.timeData?.dailyDistribution as { [key: number]: number }) || {}
  timeData.hourlyDistribution[hour] = (existingHourly[hour] || 0) + 1
  timeData.dailyDistribution[day] = (existingDaily[day] || 0) + 1
  updateData.timeData = timeData

  // Update or create analytics record
  if (existingAnalytics.docs.length > 0 && existingAnalytics.docs[0]?.id) {
    await payload.update({
      collection: 'referral-analytics',
      id: existingAnalytics.docs[0]!.id,
      data: updateData,
    })
  } else {
    await payload.create({
      collection: 'referral-analytics',
      data: {
        ...updateData,
        referralCode: doc.referralCode,
        referrer: doc.attemptedBy,
      },
    })
  }

  return doc
} 