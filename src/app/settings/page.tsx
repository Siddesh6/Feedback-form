import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Settings</h1>
                    <p className="text-muted-foreground">Manage your form settings and preferences.</p>
                </div>
                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Responses</CardTitle>
                        <CardDescription>Manage how responses are collected.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="collect-email">Collect email addresses</Label>
                                <p className="text-sm text-muted-foreground">
                                    Respondents will be required to sign in.
                                </p>
                            </div>
                            <Switch id="collect-email" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Presentation</CardTitle>
                        <CardDescription>Manage how the form and responses are presented.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="show-progress-bar">Show progress bar</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display a progress bar at the top of the form.
                                </p>
                            </div>
                            <Switch id="show-progress-bar" defaultChecked />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="confirmation-message">Confirmation message</Label>
                                <p className="text-sm text-muted-foreground">
                                    Message shown to respondents after they submit the form.
                                </p>
                            </div>
                            <Input id="confirmation-message" defaultValue="Your response has been recorded." className="max-w-sm" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Form Defaults</CardTitle>
                        <CardDescription>Default settings for new forms.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                                <Label htmlFor="default-required">Make questions required by default</Label>
                                <p className="text-sm text-muted-foreground">
                                   New questions will be marked as required.
                                </p>
                           </div>
                            <Switch id="default-required" />
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                </div>
            </div>
        </AdminLayout>
    )
}
