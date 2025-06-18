import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Share, Heart, Plus, ArrowRight, Unlink, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface PartnerConnection {
  id: string;
  userId: string;
  partnerId?: string;
  partnerName?: string;
  status: 'pending' | 'connected' | 'invited';
  inviteCode?: string;
  createdAt: string;
}

export default function PartnerSync() {
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: partnerStatus, isLoading, refetch } = useQuery({
    queryKey: ["/api/partner/status", user?.uid],
    enabled: !!user?.uid,
    retry: false,
  });

  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/partner/generate-code", {
        userId: user?.uid
      });
      return response.json();
    },
    onSuccess: (data) => {
      refetch();
      toast({
        title: "Invite Code Generated",
        description: "Share this code with your partner to connect your accounts.",
      });
    },
  });

  const linkPartnerMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/partner/link", {
        userId: user?.uid,
        inviteCode: code
      });
      return response.json();
    },
    onSuccess: (data) => {
      refetch();
      setInviteCode("");
      toast({
        title: "Partner Connected!",
        description: `You're now synced with ${data.partnerName}. Enjoy personalized couple experiences.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: "Invalid invite code or partner already connected.",
        variant: "destructive",
      });
    },
  });

  const unlinkPartnerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/partner/unlink", {
        userId: user?.uid
      });
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Partner Unlinked",
        description: "You can reconnect anytime using a new invite code.",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard.",
    });
  };

  const shareInviteCode = (code: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Join me on Seggs.Life",
        text: "Use this code to connect with me on Seggs.Life for personalized couple experiences",
        url: `https://seggs.life/partner-invite?code=${code}`
      });
    } else {
      copyToClipboard(code);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center pb-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#7f1d1d] border-t-transparent rounded-full" />
      </div>
    );
  }

  const connection = partnerStatus as PartnerConnection;

  return (
    <div className="min-h-screen bg-[#f5f3f0] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8" />
          <h1 className="text-2xl font-serif font-bold">Partner Sync</h1>
        </div>
        <p className="text-white/80">
          Connect with your partner for personalized couple experiences
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Status */}
        <Card className="border-[#d6c0a5]/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
              <Heart className="h-5 w-5 text-[#7f1d1d]" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connection?.status === 'connected' && connection.partnerName ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#7f1d1d]/10 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-[#7f1d1d]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#4b4f56]">
                        Connected with {connection.partnerName}
                      </p>
                      <p className="text-sm text-[#4b4f56]/70">
                        Enjoying personalized couple experiences
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Connected
                  </Badge>
                </div>
                
                <div className="pt-4 border-t border-[#d6c0a5]/30">
                  <p className="text-sm text-[#4b4f56]/70 mb-3">
                    Want to disconnect? You can unlink and reconnect anytime.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => unlinkPartnerMutation.mutate()}
                    disabled={unlinkPartnerMutation.isPending}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Unlink Partner
                  </Button>
                </div>
              </div>
            ) : connection?.status === 'pending' && connection.inviteCode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#4b4f56]">
                      Invitation Sent
                    </p>
                    <p className="text-sm text-[#4b4f56]/70">
                      Waiting for your partner to accept
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    Pending
                  </Badge>
                </div>

                <div className="bg-[#f5f3f0] p-4 rounded-xl border border-[#d6c0a5]/30">
                  <p className="text-sm text-[#4b4f56] mb-3">Your invite code:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white p-3 rounded-lg border border-[#d6c0a5]/30 font-mono text-lg text-center font-bold text-[#7f1d1d]">
                      {connection.inviteCode}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(connection.inviteCode!)}
                      className="border-[#7f1d1d] text-[#7f1d1d]"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => shareInviteCode(connection.inviteCode!)}
                      className="border-[#7f1d1d] text-[#7f1d1d]"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-16 w-16 mx-auto mb-4 text-[#d6c0a5]" />
                <h3 className="font-semibold text-[#4b4f56] mb-2">No Partner Connected</h3>
                <p className="text-[#4b4f56]/70 mb-6 max-w-sm mx-auto">
                  Connect with your partner to unlock personalized experiences designed for both of your blueprints
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Invite Code */}
        {(!connection || connection.status === 'connected') && (
          <Card className="border-[#d6c0a5]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
                <Plus className="h-5 w-5 text-[#7f1d1d]" />
                Invite Your Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#4b4f56]/70 mb-4">
                Generate a unique invite code to share with your partner. They'll use this code to connect your accounts.
              </p>
              <Button 
                onClick={() => generateCodeMutation.mutate()}
                disabled={generateCodeMutation.isPending}
                className="w-full bg-[#7f1d1d] hover:bg-[#7f1d1d]/90 text-white"
              >
                {generateCodeMutation.isPending ? (
                  "Generating..."
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Invite Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enter Invite Code */}
        {(!connection || connection.status !== 'connected') && (
          <Card className="border-[#d6c0a5]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4b4f56]">
                <ArrowRight className="h-5 w-5 text-[#7f1d1d]" />
                Join Your Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#4b4f56]/70 mb-4">
                Have an invite code from your partner? Enter it below to connect your accounts.
              </p>
              <div className="space-y-4">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="border-[#d6c0a5]/50 focus:border-[#7f1d1d]"
                />
                <Button 
                  onClick={() => linkPartnerMutation.mutate(inviteCode)}
                  disabled={!inviteCode.trim() || linkPartnerMutation.isPending}
                  className="w-full bg-[#7f1d1d] hover:bg-[#7f1d1d]/90 text-white"
                >
                  {linkPartnerMutation.isPending ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Connect with Partner
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="border-[#d6c0a5]/30 shadow-sm bg-gradient-to-br from-[#7f1d1d]/5 to-[#7f1d1d]/10">
          <CardHeader>
            <CardTitle className="text-[#4b4f56]">
              Why Connect with Your Partner?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#7f1d1d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="h-3 w-3 text-[#7f1d1d]" />
                </div>
                <div>
                  <p className="font-medium text-[#4b4f56]">Personalized for Both</p>
                  <p className="text-sm text-[#4b4f56]/70">Get suggestions tailored to both your blueprints</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#7f1d1d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 text-[#7f1d1d]" />
                </div>
                <div>
                  <p className="font-medium text-[#4b4f56]">Couple Experiences</p>
                  <p className="text-sm text-[#4b4f56]/70">Access exclusive content designed for partnerships</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#7f1d1d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-3 w-3 text-[#7f1d1d]" />
                </div>
                <div>
                  <p className="font-medium text-[#4b4f56]">Enhanced Communication</p>
                  <p className="text-sm text-[#4b4f56]/70">Improve intimacy through understanding each other's blueprints</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}