"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIdea, useValidationOfIdea } from "@/hooks/api-hooks/use-ideas";
import {
  CircleCheckIcon,
  ExternalLink,
  MehIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const ValidationPage = () => {
  const { ideaId } = useParams<{ ideaId: string }>();

  const validationQuery = useValidationOfIdea(ideaId);
  const ideaQuery = useIdea(ideaId);

  if (validationQuery.isPending || ideaQuery.isPending) return <>Loading...</>;

  if (validationQuery.isError || ideaQuery.isError) return <>Error</>;

  return (
    <div className="mt-10">
      <Card className="relative max-w-sm border-none">
        <CardHeader>
          <CardDescription>
            <span>Overall Score</span>
          </CardDescription>
          <CardTitle className="md:text-5xl text-2xl font-semibold tabular-nums">
            {validationQuery.data.score}/10
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <CircleCheckIcon className="size-3 text-green-500" />
              Average
            </Badge>
          </div>
        </CardHeader>

        <CardFooter className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="line-clamp-1 font-medium">Feasibility</div>
            <div className="text-muted-foreground">
              {validationQuery.data.feasibilityScore}/10
            </div>
          </div>
          <div>
            <div className="line-clamp-1 font-medium">Market Fit</div>
            <div className="text-muted-foreground">
              {validationQuery.data.marketFitScore}/10
            </div>
          </div>
          <div>
            <div className="line-clamp-1 font-medium">Innovation</div>
            <div className="text-muted-foreground">
              {validationQuery.data.innovationScore}/10
            </div>
          </div>
        </CardFooter>
      </Card>
      <pre>{JSON.stringify(validationQuery.data, null, 2)}</pre>
    </div>
  );
};

export default ValidationPage;
