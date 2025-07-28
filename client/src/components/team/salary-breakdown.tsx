import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface Player {
  id: string;
  name: string;
  position: string;
  salary: number;
  contractYears: number;
  capHit?: number;
}

interface SalaryBreakdownProps {
  players: Player[];
  salaryCap: number;
  salaryCapUsed: number;
}

export function SalaryBreakdown({ players, salaryCap, salaryCapUsed }: SalaryBreakdownProps) {
  const totalSalaries = players.reduce((total, player) => total + (player.salary || 0), 0);
  const averageSalary = players.length > 0 ? totalSalaries / players.length : 0;
  const capSpaceRemaining = salaryCap - salaryCapUsed;
  const capPercentage = (salaryCapUsed / salaryCap) * 100;
  
  // Group players by position for better organization
  const playersByPosition = players.reduce((acc, player) => {
    const pos = player.position || 'Unknown';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000000).toFixed(2)}M`;
  };

  const getContractStatusColor = (years: number) => {
    if (years <= 1) return "bg-red-500/20 text-red-400";
    if (years <= 2) return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* Salary Cap Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Salary Cap</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{formatSalary(salaryCap)}</div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Used ({capPercentage.toFixed(1)}%)</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{formatSalary(salaryCapUsed)}</div>
          <Progress value={capPercentage} className="mt-2" />
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Remaining</div>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{formatSalary(capSpaceRemaining)}</div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Avg Salary</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{formatSalary(averageSalary)}</div>
        </div>
      </div>

      {/* Detailed Player Salaries */}
      <Card>
        <CardHeader>
          <CardTitle>Player Contracts</CardTitle>
          <CardDescription>Detailed breakdown of all player salaries and contract terms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Annual Salary</TableHead>
                <TableHead>Cap Hit</TableHead>
                <TableHead>Contract Length</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players
                .sort((a, b) => (b.salary || 0) - (a.salary || 0))
                .map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.position}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{formatSalary(player.salary || 0)}</TableCell>
                  <TableCell className="font-mono">{formatSalary(player.capHit || player.salary || 0)}</TableCell>
                  <TableCell>{player.contractYears || 1} year{(player.contractYears || 1) !== 1 ? 's' : ''}</TableCell>
                  <TableCell>
                    <Badge className={getContractStatusColor(player.contractYears || 1)}>
                      {(player.contractYears || 1) <= 1 ? 'Expiring' : 
                       (player.contractYears || 1) <= 2 ? 'Short-term' : 'Long-term'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {players.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No players found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Position Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Salary by Position</CardTitle>
          <CardDescription>Contract distribution across different positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(playersByPosition).map(([position, positionPlayers]) => {
              const positionTotal = positionPlayers.reduce((total, player) => total + (player.salary || 0), 0);
              const positionAvg = positionTotal / positionPlayers.length;
              const positionPercentage = (positionTotal / totalSalaries) * 100;
              
              return (
                <div key={position} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{position}</h4>
                    <Badge variant="secondary">{positionPlayers.length} players</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-mono">{formatSalary(positionTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average:</span>
                      <span className="font-mono">{formatSalary(positionAvg)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>% of Cap:</span>
                      <span>{positionPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={positionPercentage} className="mt-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}