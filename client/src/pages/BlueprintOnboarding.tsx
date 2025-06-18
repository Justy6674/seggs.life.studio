import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface QuestionOption {
  value: string;
  label: string;
  scores: {
    sensual: number;
    sexual: number;
    energetic: number;
    kinky: number;
    shapeshifter: number;
  };
}

interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

const blueprintQuestions: Question[] = [
  {
    id: 1,
    text: "What kind of touch do you find most arousing?",
    options: [
      {
        value: "gentle",
        label: "Gentle, slow caresses and soft touches",
        scores: { sensual: 3, sexual: 1, energetic: 0, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "direct",
        label: "Direct touch to erogenous zones",
        scores: { sensual: 0, sexual: 3, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "teasing",
        label: "Teasing touches that build anticipation",
        scores: { sensual: 1, sexual: 1, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "intense",
        label: "Intense, possibly rough physical contact",
        scores: { sensual: 0, sexual: 1, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 2,
    text: "What turns you on most in intimate moments?",
    options: [
      {
        value: "emotional",
        label: "Emotional connection and feeling cherished",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "physical",
        label: "Physical pleasure and bodily sensations",
        scores: { sensual: 1, sexual: 3, energetic: 0, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "psychological",
        label: "Psychological arousal and mental stimulation",
        scores: { sensual: 0, sexual: 0, energetic: 3, kinky: 2, shapeshifter: 2 }
      },
      {
        value: "variety",
        label: "Variety and trying new things",
        scores: { sensual: 1, sexual: 1, energetic: 1, kinky: 1, shapeshifter: 3 }
      }
    ]
  },
  {
    id: 3,
    text: "What environment helps you feel most sexually open?",
    options: [
      {
        value: "romantic",
        label: "Romantic atmosphere with candles and soft music",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "spontaneous",
        label: "Spontaneous moments without much setup",
        scores: { sensual: 0, sexual: 3, energetic: 1, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "playful",
        label: "Playful, teasing interactions throughout the day",
        scores: { sensual: 1, sexual: 1, energetic: 3, kinky: 0, shapeshifter: 2 }
      },
      {
        value: "structured",
        label: "Structured scenarios or role-playing",
        scores: { sensual: 0, sexual: 1, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 4,
    text: "How do you prefer to build sexual tension?",
    options: [
      {
        value: "slowly",
        label: "Slowly over time with gentle escalation",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "directly",
        label: "Direct communication about desires",
        scores: { sensual: 0, sexual: 3, energetic: 0, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "anticipation",
        label: "Building anticipation and suspense",
        scores: { sensual: 1, sexual: 1, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "power",
        label: "Through power dynamics or control",
        scores: { sensual: 0, sexual: 1, energetic: 0, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 5,
    text: "What type of communication during intimacy excites you?",
    options: [
      {
        value: "appreciation",
        label: "Words of appreciation and love",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "instruction",
        label: "Clear instructions about what feels good",
        scores: { sensual: 0, sexual: 3, energetic: 0, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "creative",
        label: "Creative, imaginative scenarios",
        scores: { sensual: 1, sexual: 0, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "commanding",
        label: "Commanding or submissive language",
        scores: { sensual: 0, sexual: 1, energetic: 0, kinky: 3, shapeshifter: 1 }
      }
    ]
  }
];

interface BlueprintOnboardingProps {
  onComplete: (results: any) => void;
}

export default function BlueprintOnboarding({ onComplete }: BlueprintOnboardingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { user } = useAuth();

  const saveResultsMutation = useMutation({
    mutationFn: async (results: any) => {
      const response = await apiRequest("POST", "/api/blueprint/complete", {
        userId: user?.uid,
        results
      });
      return response.json();
    },
    onSuccess: (data) => {
      onComplete(data);
    },
  });

  const calculateResults = () => {
    const scores = {
      sensual: 0,
      sexual: 0,
      energetic: 0,
      kinky: 0,
      shapeshifter: 0,
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = blueprintQuestions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(opt => opt.value === answer);
      
      if (option) {
        Object.entries(option.scores).forEach(([type, points]) => {
          scores[type as keyof typeof scores] += points;
        });
      }
    });

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = Object.fromEntries(
      Object.entries(scores).map(([type, score]) => [
        type,
        Math.round((score / total) * 100)
      ])
    );

    const primaryType = Object.entries(percentages).reduce((max, [type, percentage]) =>
      percentage > max.percentage ? { type, percentage } : max,
      { type: '', percentage: 0 }
    ).type;

    const results = {
      scores: percentages,
      primaryType: primaryType.charAt(0).toUpperCase() + primaryType.slice(1),
      completedAt: new Date().toISOString(),
    };

    saveResultsMutation.mutate(results);
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [blueprintQuestions[currentQuestion].id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < blueprintQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / blueprintQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] via-[#faf8f5] to-[#f0ede8] p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-[#7f1d1d]" />
            <h1 className="text-3xl font-serif font-bold text-[#4b4f56]">Discover Your Blueprint</h1>
          </div>
          <p className="text-lg text-[#4b4f56]/80 max-w-lg mx-auto">
            Understanding your unique pathway to pleasure and intimacy
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-[#d6c0a5]/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#4b4f56]">
                Question {currentQuestion + 1} of {blueprintQuestions.length}
              </span>
              <span className="text-sm text-[#4b4f56]/70">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-[#d6c0a5]/30"
            />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="shadow-lg border-[#d6c0a5]/30 mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-[#4b4f56] leading-relaxed">
              {blueprintQuestions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[blueprintQuestions[currentQuestion].id] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {blueprintQuestions[currentQuestion].options.map((option) => (
                <div 
                  key={option.value} 
                  className="flex items-start space-x-4 p-4 rounded-xl border-2 border-[#d6c0a5]/30 hover:border-[#7f1d1d]/30 hover:bg-[#7f1d1d]/5 cursor-pointer transition-all duration-200"
                >
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value} 
                    className="mt-1 border-[#7f1d1d] text-[#7f1d1d]" 
                  />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer leading-relaxed text-[#4b4f56] font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="border-[#7f1d1d] text-[#7f1d1d] hover:bg-[#7f1d1d] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={!answers[blueprintQuestions[currentQuestion].id]}
            className="bg-[#7f1d1d] hover:bg-[#7f1d1d]/90 text-white px-8"
          >
            {currentQuestion === blueprintQuestions.length - 1 ? (
              saveResultsMutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get My Blueprint
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              )
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}