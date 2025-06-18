import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, LogOut, Heart, Trash2, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleLogout = () => {
    // Firebase logout would be handled here
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be sent to your email within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and preferences
        </p>
      </div>

      <div className="px-6 pb-12 max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'No email available'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Display Name</p>
                <p className="text-sm text-muted-foreground">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Recently'
                  }
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Premium
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new suggestions and partner activity
                </p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Updates</p>
                <p className="text-sm text-muted-foreground">
                  Weekly insights and relationship tips
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Data Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Share anonymized data to improve our AI recommendations
                </p>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={setDataSharing}
              />
            </div>
            
            <Separator className="bg-border" />
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Download a copy of all your personal data and interactions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Current Plan</p>
                <p className="text-sm text-muted-foreground">Premium Member</p>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Next Billing</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-primary">$19.99/month</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
            
            <Separator className="bg-border" />
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleDeleteAccount}
                className="w-full justify-start border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-card border shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Seggs.Life Studio</p>
              <p className="text-xs text-muted-foreground">Version 2.0.0</p>
              <p className="text-xs text-muted-foreground">
                © 2024 Seggs.Life. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}