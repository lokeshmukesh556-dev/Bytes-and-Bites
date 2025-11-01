import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">About & Contact</h1>
        <p className="text-muted-foreground">
          Information about the Violet Bites service and how to get in touch.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Violet Bites</CardTitle>
          <CardDescription>Your campus canteen, just a click away.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Violet Bites is a modern solution designed to streamline the canteen ordering process on campus. Our platform allows students and staff to browse menus, place orders, and make payments seamlessly from their devices.
          </p>
          <p>
            Our mission is to reduce wait times, improve the ordering experience, and provide canteen administrators with powerful tools to manage their operations efficiently.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Have questions or need support? Reach out to us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Mail className="size-5 text-muted-foreground" />
                <a href="mailto:vantawork17@gmail.com" className="hover:underline">
                    vantawork17@gmail.com
                </a>
            </div>
            <div className="flex items-start gap-4">
                <Phone className="size-5 text-muted-foreground mt-1" />
                <div className="flex flex-col">
                  <span>+91 9940918442</span>
                  <span>+91 6383350423</span>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <MapPin className="size-5 text-muted-foreground mt-1" />
                <div>
                    <p>JJCET</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
