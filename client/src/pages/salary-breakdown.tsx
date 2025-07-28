import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, PiggyBank } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function SalaryBreakdown() {
  const [selectedTeam, setSelectedTeam] = useState("mock-team-1");

  const { data: teams } = useQuery({ queryKey: ["/api/teams"] });
  const { data: players } = useQuery({ queryKey: ["/api/players"] });

  // Mock detailed salary data
  const salaryData = {
    salaryCap: 82500000, // $82.5M
    currentSalary: 75200000, // $75.2M
    remainingSpace: 7300000, // $7.3M
    deadMoney: 2100000, // $2.1M
    bonuses: 1800000, // $1.8M
    ltirPool: 0,
    emergencyRecalls: 0,
  };

  const teamRoster = [
    { id: "p1", name: "Connor McDavid", position: "C", salary: 12500000, contractYears: 8, nmc: true, ntc: false, bonus: 500000, cap_hit: 12500000 },
    { id: "p2", name: "Leon Draisaitl", position: "LW", salary: 8500000, contractYears: 8, nmc: false, ntc: true, bonus: 0, cap_hit: 8500000 },
    { id: "p3", name: "Darnell Nurse", position: "D", salary: 9250000, contractYears: 6, nmc: false, ntc: false, bonus: 0, cap_hit: 9250000 },
    { id: "p4", name: "Ryan Nugent-Hopkins", position: "C", salary: 5125000, contractYears: 8, nmc: false, ntc: false, bonus: 0, cap_hit: 5125000 },
    { id: "p5", name: "Zach Hyman", position: "LW", salary: 5500000, contractYears: 7, nmc: false, ntc: false, bonus: 0, cap_hit: 5500000 },
    { id: "p6", name: "Evander Kane", position: "LW", salary: 5125000, contractYears: 4, nmc: false, ntc: false, bonus: 0, cap_hit: 5125000 },
    { id: "p7", name: "Adam Henrique", position: "C", salary: 3000000, contractYears: 2, nmc: false, ntc: false, bonus: 0, cap_hit: 3000000 },
    { id: "p8", name: "Ryan McLeod", position: "C", salary: 2100000, contractYears: 3, nmc: false, ntc: false, bonus: 0, cap_hit: 2100000 },
    { id: "p9", name: "Mattias Ekholm", position: "D", salary: 6000000, contractYears: 4, nmc: false, ntc: true, bonus: 0, cap_hit: 6000000 },
    { id: "p10", name: "Evan Bouchard", position: "D", salary: 3900000, contractYears: 2, nmc: false, ntc: false, bonus: 0, cap_hit: 3900000 },
    { id: "p11", name: "Brett Kulak", position: "D", salary: 2750000, contractYears: 4, nmc: false, ntc: false, bonus: 0, cap_hit: 2750000 },
    { id: "p12", name: "Calvin Pickard", position: "G", salary: 1000000, contractYears: 2, nmc: false, ntc: false, bonus: 0, cap_hit: 1000000 },
    { id: "p13", name: "Stuart Skinner", position: "G", salary: 2600000, contractYears: 3, nmc: false, ntc: false, bonus: 0, cap_hit: 2600000 },
    { id: "p14", name: "Connor Brown", position: "RW", salary: 775000, contractYears: 1, nmc: false, ntc: false, bonus: 0, cap_hit: 775000 },
    { id: "p15", name: "Sam Gagner", position: "C", salary: 775000, contractYears: 1, nmc: false, ntc: false, bonus: 0, cap_hit: 775000 },
  ];

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const capPercentage = ((salaryData.currentSalary / salaryData.salaryCap) * 100);
  const isOverCap = salaryData.currentSalary > salaryData.salaryCap;

  const positionBreakdown = {
    forwards: teamRoster.filter(p => ['C', 'LW', 'RW'].includes(p.position)),
    defensemen: teamRoster.filter(p => p.position === 'D'),
    goalies: teamRoster.filter(p => p.position === 'G'),
  };

  const forwardsSalary = positionBreakdown.forwards.reduce((sum, p) => sum + p.salary, 0);
  const defensemenSalary = positionBreakdown.defensemen.reduce((sum, p) => sum + p.salary, 0);
  const goaliesSalary = positionBreakdown.goalies.reduce((sum, p) => sum + p.salary, 0);

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Salary Cap Management</h1>
        <p className="text-gray-300">Detailed breakdown of team finances and contract information</p>
      </div>

      {/* Cap Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{formatSalary(salaryData.salaryCap)}</div>
                <div className="text-sm text-gray-300">Salary Cap</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${isOverCap ? 'from-red-900/40 to-red-800/40 border-red-500/20' : 'from-green-900/40 to-green-800/40 border-green-500/20'}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              {isOverCap ? <AlertTriangle className="h-8 w-8 text-red-400" /> : <CheckCircle className="h-8 w-8 text-green-400" />}
              <div>
                <div className="text-2xl font-bold text-white">{formatSalary(salaryData.currentSalary)}</div>
                <div className="text-sm text-gray-300">Current Salary</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <PiggyBank className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{formatSalary(salaryData.remainingSpace)}</div>
                <div className="text-sm text-gray-300">Cap Space</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">{capPercentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-300">Cap Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cap Usage Progress */}
      <Card className="bg-gray-800/50 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white">Salary Cap Usage</CardTitle>
          <CardDescription>Current team salary breakdown against the cap</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Used: {formatSalary(salaryData.currentSalary)}</span>
                <span>Cap: {formatSalary(salaryData.salaryCap)}</span>
              </div>
              <Progress 
                value={capPercentage} 
                className={`h-4 ${isOverCap ? 'bg-red-900' : 'bg-gray-700'}`}
              />
            </div>
            
            {isOverCap && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 font-medium">Over Salary Cap</span>
                </div>
                <p className="text-red-200 text-sm mt-1">
                  Team is {formatSalary(salaryData.currentSalary - salaryData.salaryCap)} over the salary cap. 
                  Trades or releases needed before season start.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="roster" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roster">Roster Breakdown</TabsTrigger>
          <TabsTrigger value="position">By Position</TabsTrigger>
          <TabsTrigger value="contracts">Contract Details</TabsTrigger>
          <TabsTrigger value="projection">Cap Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="roster" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white">Player Salaries</CardTitle>
              <CardDescription>Complete roster with salary information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Player</TableHead>
                      <TableHead className="text-gray-300">Position</TableHead>
                      <TableHead className="text-center text-gray-300">Salary</TableHead>
                      <TableHead className="text-center text-gray-300">Cap Hit</TableHead>
                      <TableHead className="text-center text-gray-300">Years</TableHead>
                      <TableHead className="text-center text-gray-300">Clauses</TableHead>
                      <TableHead className="text-center text-gray-300">% of Cap</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamRoster.map((player) => (
                      <TableRow key={player.id} className="hover:bg-gray-700/30">
                        <TableCell className="font-medium text-white">{player.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-white font-semibold">
                          {formatSalary(player.salary)}
                        </TableCell>
                        <TableCell className="text-center text-white font-semibold">
                          {formatSalary(player.cap_hit)}
                        </TableCell>
                        <TableCell className="text-center text-gray-300">{player.contractYears}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-1">
                            {player.nmc && <Badge variant="destructive" className="text-xs">NMC</Badge>}
                            {player.ntc && <Badge variant="secondary" className="text-xs">NTC</Badge>}
                            {!player.nmc && !player.ntc && <span className="text-gray-500">-</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-gray-300">
                          {((player.cap_hit / salaryData.salaryCap) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Forwards ({positionBreakdown.forwards.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{formatSalary(forwardsSalary)}</div>
                    <div className="text-sm text-gray-300">Total Salary</div>
                    <div className="text-xs text-gray-400">
                      {((forwardsSalary / salaryData.salaryCap) * 100).toFixed(1)}% of cap
                    </div>
                  </div>
                  <Progress value={(forwardsSalary / salaryData.salaryCap) * 100} className="h-2" />
                  <div className="space-y-2">
                    {positionBreakdown.forwards.slice(0, 5).map((player) => (
                      <div key={player.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{player.name}</span>
                        <span className="text-white font-medium">{formatSalary(player.salary)}</span>
                      </div>
                    ))}
                    {positionBreakdown.forwards.length > 5 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{positionBreakdown.forwards.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Defense ({positionBreakdown.defensemen.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{formatSalary(defensemenSalary)}</div>
                    <div className="text-sm text-gray-300">Total Salary</div>
                    <div className="text-xs text-gray-400">
                      {((defensemenSalary / salaryData.salaryCap) * 100).toFixed(1)}% of cap
                    </div>
                  </div>
                  <Progress value={(defensemenSalary / salaryData.salaryCap) * 100} className="h-2" />
                  <div className="space-y-2">
                    {positionBreakdown.defensemen.map((player) => (
                      <div key={player.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{player.name}</span>
                        <span className="text-white font-medium">{formatSalary(player.salary)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-900/20 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-300 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Goalies ({positionBreakdown.goalies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{formatSalary(goaliesSalary)}</div>
                    <div className="text-sm text-gray-300">Total Salary</div>
                    <div className="text-xs text-gray-400">
                      {((goaliesSalary / salaryData.salaryCap) * 100).toFixed(1)}% of cap
                    </div>
                  </div>
                  <Progress value={(goaliesSalary / salaryData.salaryCap) * 100} className="h-2" />
                  <div className="space-y-2">
                    {positionBreakdown.goalies.map((player) => (
                      <div key={player.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{player.name}</span>
                        <span className="text-white font-medium">{formatSalary(player.salary)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white">Contract Clauses</CardTitle>
                <CardDescription>Players with trade protection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamRoster.filter(p => p.nmc || p.ntc).map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{player.name}</div>
                        <div className="text-sm text-gray-300">{player.position} • {formatSalary(player.salary)}</div>
                      </div>
                      <div className="flex space-x-2">
                        {player.nmc && <Badge variant="destructive">No-Movement</Badge>}
                        {player.ntc && <Badge variant="secondary">No-Trade</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Free Agents</CardTitle>
                <CardDescription>Contracts expiring this season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamRoster.filter(p => p.contractYears <= 1).map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{player.name}</div>
                        <div className="text-sm text-gray-300">{player.position} • {formatSalary(player.salary)}</div>
                      </div>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        UFA 2025
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white">Multi-Year Cap Projection</CardTitle>
              <CardDescription>Projected salary cap implications for upcoming seasons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-white">2024-25</div>
                    <div className="text-lg text-blue-400">{formatSalary(salaryData.currentSalary)}</div>
                    <div className="text-sm text-gray-300">Current Season</div>
                  </div>
                  <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-white">2025-26</div>
                    <div className="text-lg text-purple-400">{formatSalary(salaryData.currentSalary - 5000000)}</div>
                    <div className="text-sm text-gray-300">Projected</div>
                  </div>
                  <div className="text-center p-4 bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-white">2026-27</div>
                    <div className="text-lg text-green-400">{formatSalary(salaryData.currentSalary - 8000000)}</div>
                    <div className="text-sm text-gray-300">Projected</div>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Key Contract Expirations</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">2025 Free Agents:</span>
                      <span className="text-white">3 players • {formatSalary(2550000)} cap relief</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">2026 Free Agents:</span>
                      <span className="text-white">2 players • {formatSalary(15750000)} cap relief</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">2027 Free Agents:</span>
                      <span className="text-white">4 players • {formatSalary(28250000)} cap relief</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}