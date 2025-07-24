// src/app/(cms)/admin/logo/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';

export default function LogoUpdatePage() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">Update Logo</CardTitle>
          <CardDescription>
            Upload a new SVG logo. The new logo will automatically be applied
            across the entire website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-headline font-light mb-4">Current Logo</h3>
            <div className="p-4 border rounded-md flex items-center justify-center bg-gray-50">
                <Logo className="w-24 h-24 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-upload">Upload New Logo (SVG only)</Label>
            <Input id="logo-upload" type="file" accept=".svg" />
            <p className="text-sm text-muted-foreground">
              For best results, use a square SVG file with a transparent background.
            </p>
          </div>
          
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
