import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserMemory } from "@/hooks/useUserMemory";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Brain, ChevronLeft, ChevronRight, BarChart3, Heart, Users } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    label: string;
    scores: {
      sensual: number;
      sexual: number;
      energetic: number;
      kinky: number;
      shapeshifter: number;
    };
  }[];
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
        value: "taboo",
        label: "Exploring taboo or unconventional desires",
        scores: { sensual: 0, sexual: 1, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 3,
    text: "How do you prefer to be approached for intimacy?",
    options: [
      {
        value: "romantic",
        label: "With romance, flowers, candles, and ambiance",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "direct",
        label: "Direct and straightforward communication",
        scores: { sensual: 0, sexual: 3, energetic: 0, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "playful",
        label: "Through playful flirtation and building tension",
        scores: { sensual: 1, sexual: 1, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "commanding",
        label: "With confidence and taking charge",
        scores: { sensual: 0, sexual: 1, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 4,
    text: "What kind of communication during intimacy excites you?",
    options: [
      {
        value: "loving",
        label: "Loving words and expressions of affection",
        scores: { sensual: 3, sexual: 1, energetic: 0, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "descriptive",
        label: "Descriptive talk about physical sensations",
        scores: { sensual: 1, sexual: 3, energetic: 1, kinky: 1, shapeshifter: 1 }
      },
      {
        value: "anticipation",
        label: "Building anticipation with 'what if' scenarios",
        scores: { sensual: 1, sexual: 0, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "commanding",
        label: "Commands or power exchange language",
        scores: { sensual: 0, sexual: 1, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  },
  {
    id: 5,
    text: "What environment makes you feel most comfortable?",
    options: [
      {
        value: "luxurious",
        label: "Luxurious, beautiful, and aesthetically pleasing",
        scores: { sensual: 3, sexual: 0, energetic: 1, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "comfortable",
        label: "Comfortable and familiar surroundings",
        scores: { sensual: 1, sexual: 3, energetic: 0, kinky: 0, shapeshifter: 1 }
      },
      {
        value: "exciting",
        label: "Exciting or unexpected locations",
        scores: { sensual: 0, sexual: 1, energetic: 3, kinky: 1, shapeshifter: 2 }
      },
      {
        value: "structured",
        label: "Structured environments with clear boundaries",
        scores: { sensual: 0, sexual: 0, energetic: 1, kinky: 3, shapeshifter: 1 }
      }
    ]
  }
];

export default function Blueprint() {
  const { memory, updateBlueprintResults } = useUserMemory();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [partnerPrediction, setPartnerPrediction] = useState(false);

  const saveResultsMutation = useMutation({
    mutationFn: async (results: any) => {
      const response = await apiRequest("POST", "/api/blueprint-results", results);
      return response.json();
    },
    onSuccess: (data) => {
      updateBlueprintResults(data);
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
      ...percentages,
      primaryType: primaryType.charAt(0).toUpperCase() + primaryType.slice(1),
      completedAt: new Date().toISOString(),
    };

    saveResultsMutation.mutate(results);
    setShowResults(true);
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [blueprintQuestions[currentQuestion].id]: value }));
  };

  const nextQuestion = () => {
    console.log('Next button clicked, current question:', currentQuestion);
    if (currentQuestion < blueprintQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    console.log('Previous button clicked, current question:', currentQuestion);
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getBlueprintDescription = (type: string) => {
    const descriptions = {
      Sensual: "You are turned on by all of your senses being engaged - sight, sound, smell, taste, and touch. You need time, patience, and space to warm up.",
      Sexual: "You are turned on by nudity, sexual touch, and genital contact. You love the physical aspects of sex and respond well to direct stimulation.",
      Energetic: "You are turned on by anticipation, space, tease, and longing. Mental and emotional stimulation creates arousal for you.",
      Kinky: "You are turned on by what's taboo - anything that feels naughty, risqué, or forbidden. You find excitement in pushing boundaries.",
      Shapeshifter: "You are turned on by all of the blueprints depending on your mood, the day, and your partner. You're sexually flexible and diverse."
    };
    return descriptions[type as keyof typeof descriptions] || "";
  };

  const getBlueprintColor = (type: string) => {
    const colors = {
      Sensual: "from-green-400 to-emerald-600",
      Sexual: "from-red-400 to-rose-600",
      Energetic: "from-yellow-400 to-amber-600",
      Kinky: "from-purple-400 to-violet-600",
      Shapeshifter: "from-blue-400 to-indigo-600",
    };
    return colors[type as keyof typeof colors] || "from-gray-400 to-gray-600";
  };

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show results if quiz is completed
  if (showResults || memory.blueprintResults) {
    const results = memory.blueprintResults;
    if (!results) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Your Erotic Blueprint</h1>
            <p className="text-lg text-gray-600">Understanding your unique pathway to pleasure</p>
          </div>

          {/* Primary Type */}
          <Card className="mb-8 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${getBlueprintColor(results.primaryType)} flex items-center justify-center`}>
                  <Brain className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {results.primaryType}
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  {getBlueprintDescription(results.primaryType)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="text-primary" size={20} />
                <span>Your Complete Blueprint Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results).map(([type, percentage]) => {
                  if (type === 'primaryType' || type === 'completedAt') return null;
                  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 capitalize">
                          {capitalizedType}
                        </span>
                        <Badge variant={type === results.primaryType.toLowerCase() ? "default" : "outline"}>
                          {percentage}%
                        </Badge>
                      </div>
                      <Progress value={percentage as number} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {getBlueprintDescription(capitalizedType)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Partner Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-secondary" size={20} />
                <span>Partner Blueprint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {memory.partnerLinked && memory.partnerName ? (
                <div className="text-center py-6">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {memory.partnerName}'s Blueprint
                  </h3>
                  {memory.partnerBlueprint ? (
                    <div>
                      <Badge className={getBlueprintColor(memory.partnerBlueprint.primaryType)}>
                        {memory.partnerBlueprint.primaryType}
                        {memory.partnerBlueprint.isPredicted && " (Predicted)"}
                      </Badge>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">
                        Invite your partner to take the quiz or predict their blueprint
                      </p>
                      <div className="space-x-2">
                        <Button variant="outline">
                          Invite Partner
                        </Button>
                        <Button onClick={() => setPartnerPrediction(true)}>
                          Predict Blueprint
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">Connect Your Partner</h3>
                  <p className="text-gray-600 mb-4">
                    Share your journey and discover compatibility insights
                  </p>
                  <Button className="bg-secondary text-white">
                    Invite Partner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Retake Quiz
            </Button>
            <Button>
              Share Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz
  return (
    <div className="min-h-screen bg-[#4b4f56] p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">Erotic Blueprint Quiz</h1>
          <p className="text-white/80 text-lg">Discover your unique pathway to pleasure and intimacy</p>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">
                Question {currentQuestion + 1} of {blueprintQuestions.length}
              </span>
              <span className="text-sm text-white/90">
                {Math.round(((currentQuestion + 1) / blueprintQuestions.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / blueprintQuestions.length) * 100} className="h-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="shadow-xl bg-gradient-to-br from-purple-600 to-purple-800 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
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
                <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1 border-white text-white" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer leading-relaxed text-white font-medium">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="border-white/40 text-white hover:bg-white/20 bg-white/10 text-lg py-3 px-6"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={!answers[blueprintQuestions[currentQuestion].id]}
            className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white text-lg py-3 px-8 font-bold"
          >
            {currentQuestion === blueprintQuestions.length - 1 ? (
              saveResultsMutation.isPending ? (
                "Calculating..."
              ) : (
                "Get Results"
              )
            ) : (
              <>
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}