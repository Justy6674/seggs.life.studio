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
    <div className="min-h-screen bg-[#f5f3f0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8" />
          <h1 className="text-2xl font-serif font-bold">Settings</h1>
        </div>
        <p className="text-white/80">
          Manage your account and preferences
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <User className="h-5 w-5 text-[#7f1d1d]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Email</p>
                <p className="text-sm text-[#4b4f56]/70">{user?.email || 'No email available'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Display Name</p>
                <p className="text-sm text-[#4b4f56]/70">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Member Since</p>
                <p className="text-sm text-[#4b4f56]/70">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Recently'
                  }
                </p>
              </div>
              <Badge className="bg-[#7f1d1d]/10 text-[#7f1d1d] border-[#7f1d1d]/20">
                Premium
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Bell className="h-5 w-5 text-[#7f1d1d]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Push Notifications</p>
                <p className="text-sm text-[#4b4f56]/70">
                  Receive notifications for new suggestions and partner activity
                </p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator className="bg-[#d6c0a5]/30" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Email Updates</p>
                <p className="text-sm text-[#4b4f56]/70">
                  Weekly insights and relationship tips
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Shield className="h-5 w-5 text-[#7f1d1d]" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Data Sharing</p>
                <p className="text-sm text-[#4b4f56]/70">
                  Share anonymized data to improve our AI recommendations
                </p>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={setDataSharing}
              />
            </div>
            
            <Separator className="bg-[#d6c0a5]/30" />
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="w-full justify-start border-[#7f1d1d] text-[#7f1d1d] hover:bg-[#7f1d1d]/5"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <p className="text-xs text-[#4b4f56]/60">
                Download a copy of all your personal data and interactions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Heart className="h-5 w-5 text-[#7f1d1d]" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Current Plan</p>
                <p className="text-sm text-[#4b4f56]/70">Premium Member</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#4b4f56]">Next Billing</p>
                <p className="text-sm text-[#4b4f56]/70">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-[#7f1d1d]">$19.99/month</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-[#7f1d1d] text-[#7f1d1d] hover:bg-[#7f1d1d]/5"
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#4b4f56]">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
            
            <Separator className="bg-[#d6c0a5]/30" />
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleDeleteAccount}
                className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              
              <p className="text-xs text-[#4b4f56]/60">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-[#4b4f56]">Seggs.Life Studio</p>
              <p className="text-xs text-[#4b4f56]/60">Version 2.0.0</p>
              <p className="text-xs text-[#4b4f56]/60">
                © 2024 Seggs.Life. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}