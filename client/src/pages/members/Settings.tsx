import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpicinessSlider } from "@/components/ui/spiciness-slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  User, 
  Heart, 
  Link, 
  Unlink, 
  Copy,
  Save,
  Users
} from "lucide-react";

export default function Settings() {
  const { memory, updateMemory } = useUserMemory();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    gender: memory?.gender || "",
    identity: memory?.identity || "",
    spicinessLevel: memory?.spicinessLevel || 3,
  });
  
  const [partnerCode, setPartnerCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      updateMemory(formData);
      toast({
        title: "Settings Saved",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/partner/generate-invite");
      return response.json();
    },
    onSuccess: (data) => {
      setInviteCode(data.code);
      toast({
        title: "Invite Code Generated",
        description: "Share this code with your partner to connect.",
      });
    },
  });

  const linkPartnerMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/partner/link", { code });
      return response.json();
    },
    onSuccess: (data) => {
      updateMemory({ 
        partnerLinked: true, 
        partnerId: data.partnerId, 
        partnerName: data.partnerName 
      });
      setPartnerCode("");
      toast({
        title: "Partner Connected",
        description: `Successfully connected with ${data.partnerName}!`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Invalid code or partner already linked.",
        variant: "destructive",
      });
    },
  });

  const unlinkPartnerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/partner/unlink");
      return response.json();
    },
    onSuccess: () => {
      updateMemory({ 
        partnerLinked: false, 
        partnerId: undefined, 
        partnerName: undefined,
        partnerBlueprint: undefined
      });
      toast({
        title: "Partner Unlinked",
        description: "Your accounts are no longer connected.",
      });
    },
  });

  const copyInviteCode = async () => {
    if (!inviteCode) return;
    
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast({
        title: "Code Copied",
        description: "Invite code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
  };

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Settings & Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize your experience and manage your personal preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Profile */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="text-primary" size={20} />
                <span>Personal Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gender Selection */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="genderfluid">Gender fluid</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Identity/Sexual Orientation */}
              <div className="space-y-2">
                <Label htmlFor="identity">Sexual Identity</Label>
                <Select 
                  value={formData.identity} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, identity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your identity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="lesbian">Lesbian</SelectItem>
                    <SelectItem value="bisexual">Bisexual</SelectItem>
                    <SelectItem value="pansexual">Pansexual</SelectItem>
                    <SelectItem value="queer">Queer</SelectItem>
                    <SelectItem value="questioning">Questioning</SelectItem>
                    <SelectItem value="asexual">Asexual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Spiciness Level Setting */}
              <div className="space-y-2">
                <Label>Default Content Spiciness</Label>
                <SpicinessSlider
                  value={formData.spicinessLevel}
                  onChange={(value) => setFormData(prev => ({ ...prev, spicinessLevel: value }))}
                />
                <p className="text-sm text-gray-600">
                  This setting controls the default intensity level for all content across the app
                </p>
              </div>

              {/* Blueprint Status */}
              {memory.blueprintResults && (
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Your Blueprint</h4>
                      <Badge variant="secondary" className="mt-1">
                        {memory.blueprintResults.primaryType}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <Button 
                onClick={handleSave} 
                disabled={saveSettingsMutation.isPending}
                className="w-full bg-primary text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveSettingsMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Partner Connection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="text-secondary" size={20} />
                <span>Partner Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {memory.partnerLinked && memory.partnerName ? (
                /* Connected Partner */
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{memory.partnerName}</p>
                        <p className="text-sm text-gray-600">Connected & Active</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  {memory.partnerBlueprint && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-gray-900 mb-2">Partner's Blueprint</h4>
                      <Badge variant="outline">
                        {memory.partnerBlueprint.primaryType}
                        {memory.partnerBlueprint.isPredicted && " (Predicted)"}
                      </Badge>
                    </div>
                  )}

                  <Button 
                    variant="destructive" 
                    onClick={() => unlinkPartnerMutation.mutate()}
                    disabled={unlinkPartnerMutation.isPending}
                    className="w-full"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Unlink Partner
                  </Button>
                </div>
              ) : (
                /* Not Connected */
                <div className="space-y-6">
                  {/* Generate Invite Code */}
                  <div className="space-y-3">
                    <Label>Invite Your Partner</Label>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => generateInviteMutation.mutate()}
                        disabled={generateInviteMutation.isPending}
                        className="flex-1"
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Generate Invite Code
                      </Button>
                    </div>
                    
                    {inviteCode && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Your Invite Code:</p>
                            <p className="text-lg font-mono font-bold text-blue-700">{inviteCode}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={copyInviteCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Share this code with your partner to connect your accounts
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Enter Partner Code */}
                  <div className="space-y-3">
                    <Label htmlFor="partner-code">Connect with Partner Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="partner-code"
                        placeholder="Enter your partner's code"
                        value={partnerCode}
                        onChange={(e) => setPartnerCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => linkPartnerMutation.mutate(partnerCode)}
                        disabled={!partnerCode || linkPartnerMutation.isPending}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter the code your partner shared with you
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="text-gray-600" size={20} />
              <span>Privacy & Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Notification Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Daily insights and tips</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Partner activity updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Weekly progress summaries</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="privacy" value="private" defaultChecked />
                    <span className="text-sm text-gray-700">Keep everything private</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="privacy" value="partner" />
                    <span className="text-sm text-gray-700">Share with partner only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="privacy" value="anonymous" />
                    <span className="text-sm text-gray-700">Anonymous data sharing for research</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}