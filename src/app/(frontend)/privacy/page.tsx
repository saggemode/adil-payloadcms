import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy regarding the collection and use of personal information',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            This Privacy Policy explains how we collect, use, and protect your personal information when you use our e-commerce platform. We are committed to ensuring that your privacy is protected.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal identification information (name, email, phone number)</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through our payment providers)</li>
            <li>Order history and preferences</li>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Cookies and usage data</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We implement appropriate security measures to protect your data</li>
            <li>All payment transactions are encrypted</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information</li>
            <li>Secure data storage and transmission</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We use cookies to enhance your browsing experience</li>
            <li>Essential cookies for website functionality</li>
            <li>Analytics cookies to improve our services</li>
            <li>Marketing cookies (with your consent)</li>
            <li>You can manage cookie preferences in your browser settings</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment processors</li>
            <li>Shipping and delivery services</li>
            <li>Analytics providers</li>
            <li>Marketing platforms</li>
            <li>Customer support services</li>
          </ul>
          <p className="mt-4">
            These third parties have their own privacy policies and may collect information according to their own terms.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Data portability</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
          <p className="mb-4">
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Privacy Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@yourstore.com
            <br />
            Phone: [Your Phone Number]
            <br />
            Address: [Your Business Address]
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 