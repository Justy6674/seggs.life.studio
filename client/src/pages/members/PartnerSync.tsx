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
    <div className="min-h-screen bg-[#4b4f56] pb-24">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl font-bold text-white mb-4 font-serif">
          Partner Connection
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Connect with your partner for personalized couple experiences and unlock the full power of your relationship
        </p>
      </div>

      <div className="px-6 pb-12 max-w-4xl mx-auto space-y-6">
        {/* Current Status */}
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-0 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-xl">
              <Heart className="h-6 w-6 text-white" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connection?.status === 'connected' && connection.partnerName ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">
                        Connected with {connection.partnerName}
                      </p>
                      <p className="text-white/90">
                        Enjoying personalized couple experiences
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-400 text-green-900 border-0 font-bold">
                    CONNECTED
                  </Badge>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <p className="text-white/90 mb-3">
                    Want to disconnect? You can unlink and reconnect anytime.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => unlinkPartnerMutation.mutate()}
                    disabled={unlinkPartnerMutation.isPending}
                    className="border-red-400 text-red-400 hover:bg-red-500/20 bg-white/10"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Unlink Partner
                  </Button>
                </div>
              </div>
            ) : connection?.status === 'pending' && connection.inviteCode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">
                      Invitation Sent
                    </p>
                    <p className="text-white/90">
                      Waiting for your partner to accept
                    </p>
                  </div>
                  <Badge className="bg-orange-400 text-orange-900 border-0 font-bold">
                    PENDING
                  </Badge>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                  <p className="text-white font-semibold mb-3">Your invite code:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/20 p-3 rounded-lg border border-white/30 font-mono text-lg text-center font-bold text-white">
                      {connection.inviteCode}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(connection.inviteCode!)}
                      className="border-white/40 text-white hover:bg-white/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => shareInviteCode(connection.inviteCode!)}
                      className="border-white/40 text-white hover:bg-white/20"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-16 w-16 mx-auto mb-4 text-white/60" />
                <h3 className="font-bold text-white text-xl mb-2">No Partner Connected</h3>
                <p className="text-white/90 mb-6 max-w-sm mx-auto">
                  Connect with your partner to unlock personalized experiences designed for both of your blueprints
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Invite Code */}
        {(!connection || connection.status === 'connected') && (
          <Card className="bg-gradient-to-br from-rose-600 to-rose-800 border-0 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <Plus className="h-6 w-6 text-white" />
                Invite Your Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-4 text-lg">
                Generate a unique invite code to share with your partner. They'll use this code to connect your accounts.
              </p>
              <Button 
                onClick={() => generateCodeMutation.mutate()}
                disabled={generateCodeMutation.isPending}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/40 text-lg py-3 font-bold"
              >
                {generateCodeMutation.isPending ? (
                  "Generating..."
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Generate Invite Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enter Invite Code */}
        {(!connection || connection.status !== 'connected') && (
          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <ArrowRight className="h-6 w-6 text-white" />
                Join Your Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-4 text-lg">
                Have an invite code from your partner? Enter it below to connect your accounts.
              </p>
              <div className="space-y-4">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="border-white/40 focus:border-white bg-white/20 text-white placeholder:text-white/60 text-lg py-3"
                />
                <Button 
                  onClick={() => linkPartnerMutation.mutate(inviteCode)}
                  disabled={!inviteCode.trim() || linkPartnerMutation.isPending}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/40 text-lg py-3 font-bold"
                >
                  {linkPartnerMutation.isPending ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Connect with Partner
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="bg-gradient-to-br from-amber-600 to-amber-800 border-0 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Why Connect with Your Partner?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Personalized for Both</p>
                  <p className="text-white/90">Get suggestions tailored to both your blueprints</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Couple Experiences</p>
                  <p className="text-white/90">Access exclusive content designed for partnerships</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Enhanced Communication</p>
                  <p className="text-white/90">Improve intimacy through understanding each other's blueprints</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}