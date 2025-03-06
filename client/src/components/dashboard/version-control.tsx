import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, GitCommit, GitPullRequest } from "lucide-react";

interface Version {
  version: string;
  date: string;
  changes: string;
}

interface VersionControlProps {
  gameId: number;
  currentVersion: string;
}

export function VersionControl({ gameId, currentVersion }: VersionControlProps) {
  const [newVersion, setNewVersion] = useState("");
  const [changes, setChanges] = useState("");

  const versions: Version[] = [
    {
      version: "1.0.0",
      date: "2024-03-01",
      changes: "Initial release",
    },
    {
      version: "1.0.1",
      date: "2024-03-05",
      changes: "Bug fixes and performance improvements",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Current Version</Label>
              <div className="flex items-center gap-2 mt-1">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{currentVersion}</span>
              </div>
            </div>
            <div className="flex-1">
              <Label>New Version</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="e.g. 1.0.2"
                  className="font-mono"
                />
                <Button variant="secondary" size="sm">
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  Release
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Change Notes</Label>
            <Input
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              placeholder="Describe your changes..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Version History</Label>
            <ScrollArea className="h-[200px] mt-1 rounded-md border">
              <div className="p-4 space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.version}
                    className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <GitCommit className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">
                          {version.version}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {version.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {version.changes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
