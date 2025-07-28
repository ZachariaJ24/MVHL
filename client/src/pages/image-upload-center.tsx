import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Upload, 
  Image as ImageIcon, 
  User, 
  Shield, 
  Trophy, 
  CheckCircle, 
  AlertCircle,
  X,
  Calendar
} from "lucide-react";

interface ImageUpload {
  id: string;
  file: File;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  targetEntity?: string;
  tags: string[];
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview: string;
  errorMessage?: string;
}

const imageCategories = [
  {
    id: 'team-assets',
    name: 'Team Assets',
    description: 'Official team branding and visual assets',
    icon: Shield,
    color: 'bg-blue-500',
    subcategories: [
      {
        id: 'primary-logos',
        name: 'Primary Team Logos',
        specs: { maxSize: '2MB', dimensions: '500x500px', formats: ['PNG', 'SVG'] },
        namingConvention: '{TeamCity}_{TeamName}_Primary_Logo',
        examples: ['Boston_Bruins_Primary_Logo.png', 'Toronto_MapleLeafs_Primary_Logo.svg']
      },
      {
        id: 'alternate-logos',
        name: 'Alternate/Secondary Logos',
        specs: { maxSize: '2MB', dimensions: '400x400px', formats: ['PNG', 'SVG'] },
        namingConvention: '{TeamCity}_{TeamName}_{Alt/Secondary}_Logo',
        examples: ['Chicago_Blackhawks_Alternate_Logo.png', 'Montreal_Canadiens_Secondary_Logo.svg']
      },
      {
        id: 'jersey-designs',
        name: 'Jersey Designs',
        specs: { maxSize: '3MB', dimensions: '600x800px', formats: ['PNG', 'JPG'] },
        namingConvention: '{TeamCity}_{TeamName}_{Home/Away/Third}_Jersey',
        examples: ['Vegas_GoldenKnights_Home_Jersey.png', 'Tampa_Lightning_Away_Jersey.jpg']
      }
    ]
  },
  {
    id: 'player-media',
    name: 'Player Media',
    description: 'Professional player photography and graphics',
    icon: User,
    color: 'bg-green-500',
    subcategories: [
      {
        id: 'headshots',
        name: 'Official Player Headshots',
        specs: { maxSize: '5MB', dimensions: '400x400px', formats: ['JPG', 'PNG'] },
        namingConvention: '{PlayerFirstName}_{PlayerLastName}_{JerseyNumber}_{TeamAbbr}_Headshot',
        examples: ['Connor_McDavid_97_EDM_Headshot.jpg', 'Sidney_Crosby_87_PIT_Headshot.png']
      },
      {
        id: 'action-shots',
        name: 'Action/Game Photos',
        specs: { maxSize: '8MB', dimensions: '1200x800px', formats: ['JPG', 'PNG'] },
        namingConvention: '{PlayerLastName}_{Action}_{Date}_{GameVs}',
        examples: ['McDavid_Goal_2024-03-15_vs_BOS.jpg', 'Crosby_Assist_2024-02-28_vs_NYR.jpg']
      },
      {
        id: 'rookie-cards',
        name: 'Digital Player Cards',
        specs: { maxSize: '4MB', dimensions: '600x800px', formats: ['PNG', 'JPG'] },
        namingConvention: '{PlayerLastName}_{PlayerFirstName}_{Season}_Card',
        examples: ['Bedard_Connor_2024_RookieCard.png', 'Fantilli_Adam_2024_Card.jpg']
      }
    ]
  },
  {
    id: 'awards-trophies',
    name: 'Awards & Trophies',
    description: 'Championship and individual award imagery',
    icon: Trophy,
    color: 'bg-yellow-500',
    subcategories: [
      {
        id: 'championship-trophies',
        name: 'Championship Trophies',
        specs: { maxSize: '4MB', dimensions: '400x600px', formats: ['PNG', 'JPG'] },
        namingConvention: 'MVHL_{TrophyName}_{Season}',
        examples: ['MVHL_Championship_Trophy_2024.png', 'MVHL_Eastern_Conference_Trophy_2024.jpg']
      },
      {
        id: 'individual-awards',
        name: 'Individual Player Awards',
        specs: { maxSize: '3MB', dimensions: '300x400px', formats: ['PNG', 'JPG'] },
        namingConvention: '{AwardName}_{Season}_{Winner}',
        examples: ['MVP_Award_2024_McDavid.png', 'Rookie_Award_2024_Bedard.jpg']
      },
      {
        id: 'ceremony-photos',
        name: 'Award Ceremony Photos',
        specs: { maxSize: '6MB', dimensions: '1200x800px', formats: ['JPG'] },
        namingConvention: '{Event}_{Date}_{Description}',
        examples: ['Awards_Ceremony_2024-06-20_MVP_Presentation.jpg']
      }
    ]
  },
  {
    id: 'event-graphics',
    name: 'Event Graphics',
    description: 'Promotional and event-specific visual content',
    icon: Calendar,
    color: 'bg-purple-500',
    subcategories: [
      {
        id: 'draft-graphics',
        name: 'Draft Event Graphics',
        specs: { maxSize: '6MB', dimensions: '1200x600px', formats: ['PNG', 'JPG'] },
        namingConvention: 'Draft_{Year}_{Round}_{Pick}_{Description}',
        examples: ['Draft_2024_Round1_Pick1_Bedard_Selection.png', 'Draft_2024_Lottery_Results.jpg']
      },
      {
        id: 'playoff-banners',
        name: 'Playoff Promotional Banners',
        specs: { maxSize: '8MB', dimensions: '1400x600px', formats: ['PNG', 'JPG'] },
        namingConvention: 'Playoffs_{Year}_{Round}_{Teams}',
        examples: ['Playoffs_2024_Finals_BOS_vs_TOR.png', 'Playoffs_2024_Semifinals_Banner.jpg']
      },
      {
        id: 'season-graphics',
        name: 'Season/Schedule Graphics',
        specs: { maxSize: '5MB', dimensions: '1000x800px', formats: ['PNG', 'JPG'] },
        namingConvention: 'Season_{Year}_{Type}_{Description}',
        examples: ['Season_2024_Opening_Night_Schedule.png', 'Season_2024_Trade_Deadline_Countdown.jpg']
      }
    ]
  },
  {
    id: 'news-media',
    name: 'News & Media',
    description: 'Editorial and news-related visual content',
    icon: ImageIcon,
    color: 'bg-red-500',
    subcategories: [
      {
        id: 'article-headers',
        name: 'News Article Headers',
        specs: { maxSize: '4MB', dimensions: '1200x400px', formats: ['JPG', 'PNG'] },
        namingConvention: 'News_{Date}_{Headline_Keywords}',
        examples: ['News_2024-03-15_McDavid_Hat_Trick_Header.jpg', 'News_2024-02-28_Trade_Deadline_Banner.png']
      },
      {
        id: 'infographics',
        name: 'Stats Infographics',
        specs: { maxSize: '6MB', dimensions: '800x1000px', formats: ['PNG', 'JPG'] },
        namingConvention: 'Stats_{Type}_{Date}_{Subject}',
        examples: ['Stats_Standings_2024-03-01_Eastern_Conference.png', 'Stats_Player_McDavid_Season_Summary.jpg']
      }
    ]
  }
];

export function ImageUploadCenter() {
  const [uploads, setUploads] = useState<ImageUpload[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [imageTitle, setImageTitle] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [targetEntity, setTargetEntity] = useState<string>('');
  const [imageTags, setImageTags] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingImages } = useQuery({
    queryKey: ["/api/images"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/images");
      return await response.json();
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: any) => {
      const response = await apiRequest("POST", "/api/images/upload", uploadData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({
        title: "Upload successful",
        description: "Image has been uploaded and is ready to use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    if (!selectedCategory || !selectedSubcategory) {
      toast({
        title: "Select category and subcategory",
        description: "Please select both category and subcategory before uploading.",
        variant: "destructive",
      });
      return;
    }

    if (!imageTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the image.",
        variant: "destructive",
      });
      return;
    }

    const category = imageCategories.find(cat => cat.id === selectedCategory);
    const subcategory = category?.subcategories.find(sub => sub.id === selectedSubcategory);
    if (!category || !subcategory) return;

    files.forEach(file => {
      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (!subcategory.specs.formats.includes(fileExtension || '')) {
        toast({
          title: "Invalid file format",
          description: `Please use ${subcategory.specs.formats.join(', ')} format for ${subcategory.name}.`,
          variant: "destructive",
        });
        return;
      }

      const maxSizeBytes = parseFloat(subcategory.specs.maxSize) * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `File size must be under ${subcategory.specs.maxSize} for ${subcategory.name}.`,
          variant: "destructive",
        });
        return;
      }

      const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);

      const newUpload: ImageUpload = {
        id: uploadId,
        file,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        title: imageTitle,
        description: imageDescription,
        targetEntity,
        tags: imageTags.split(',').map(tag => tag.trim()).filter(Boolean),
        progress: 0,
        status: 'pending',
        preview
      };

      setUploads(prev => [...prev, newUpload]);
      setTimeout(() => uploadFile(newUpload), 100);
    });
  };

  const uploadFile = async (upload: ImageUpload) => {
    setUploads(prev => prev.map(u => 
      u.id === upload.id ? { ...u, status: 'uploading' } : u
    ));

    const uploadData = {
      file: upload.file.name, // For now, just use filename - in production would handle actual file upload
      category: upload.category,
      subcategory: upload.subcategory,
      title: upload.title,
      description: upload.description,
      targetEntity: upload.targetEntity || null,
      tags: upload.tags
    };

    try {
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(u => 
          u.id === upload.id && u.progress < 90 
            ? { ...u, progress: u.progress + 10 } 
            : u
        ));
      }, 200);

      await uploadMutation.mutateAsync(uploadData);

      clearInterval(progressInterval);
      setUploads(prev => prev.map(u => 
        u.id === upload.id 
          ? { ...u, status: 'success', progress: 100 } 
          : u
      ));

    } catch (error: any) {
      setUploads(prev => prev.map(u => 
        u.id === upload.id 
          ? { ...u, status: 'error', errorMessage: error.message } 
          : u
      ));
    }
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status !== 'success'));
  };

  const selectedCategoryData = imageCategories.find(cat => cat.id === selectedCategory);
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(sub => sub.id === selectedSubcategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MVHL Image Management Center</h1>
        <p className="text-muted-foreground mt-2">
          Professional image upload system with strict categorization and naming conventions for the Major Virtual Hockey League
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Image Categories</CardTitle>
              <CardDescription>Select the type of image you want to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedCategory === category.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory('');
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg text-white ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        {selectedCategory === category.id && (
                          <Badge variant="outline" className="mt-2">
                            {category.subcategories.length} subcategories
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Details</CardTitle>
              <CardDescription>
                {selectedCategoryData 
                  ? `Upload ${selectedCategoryData.name.toLowerCase()} with specific requirements`
                  : 'Select a category to begin uploading'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedCategoryData && (
                <>
                  {/* Subcategory Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific image type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategoryData.subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSubcategoryData && (
                    <>
                      {/* Naming Convention Display */}
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Naming Convention:</strong> {selectedSubcategoryData.namingConvention}
                          <br />
                          <strong>Examples:</strong> {selectedSubcategoryData.examples.join(' • ')}
                        </AlertDescription>
                      </Alert>

                      {/* Technical Specifications */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium">Max Size</div>
                          <div className="text-lg font-bold text-primary">{selectedSubcategoryData.specs.maxSize}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Dimensions</div>
                          <div className="text-lg font-bold text-primary">{selectedSubcategoryData.specs.dimensions}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Formats</div>
                          <div className="text-lg font-bold text-primary">{selectedSubcategoryData.specs.formats.join(', ')}</div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Image Title *</Label>
                          <Input
                            id="title"
                            value={imageTitle}
                            onChange={(e) => setImageTitle(e.target.value)}
                            placeholder="Enter descriptive title..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="entity">Target Entity</Label>
                          <Input
                            id="entity"
                            value={targetEntity}
                            onChange={(e) => setTargetEntity(e.target.value)}
                            placeholder="Team/Player/Event name..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={imageDescription}
                          onChange={(e) => setImageDescription(e.target.value)}
                          placeholder="Detailed description of the image content..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={imageTags}
                          onChange={(e) => setImageTags(e.target.value)}
                          placeholder="season-2024, playoffs, eastern-conference..."
                        />
                      </div>

                      {/* File Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Drop {selectedSubcategoryData.name.toLowerCase()} here
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          multiple
                          accept={selectedSubcategoryData.specs.formats.map(f => `.${f.toLowerCase()}`).join(',')}
                          onChange={handleFileInput}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button asChild>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            Choose Files
                          </label>
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {!selectedCategoryData && (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Category</h3>
                  <p className="text-muted-foreground">
                    Choose an image category from the left panel to begin uploading
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upload Queue</CardTitle>
                <CardDescription>Track the progress of your image uploads</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCompleted}
                disabled={!uploads.some(u => u.status === 'success')}
              >
                Clear Completed
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={upload.preview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold truncate">{upload.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {upload.category} • {upload.subcategory}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {upload.status === 'success' && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {upload.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        {upload.status === 'uploading' && (
                          <Badge variant="outline">
                            <div className="animate-spin h-3 w-3 mr-1 border border-primary border-t-transparent rounded-full"></div>
                            Uploading
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUpload(upload.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-2" />
                    )}
                    {upload.status === 'error' && upload.errorMessage && (
                      <p className="text-sm text-red-500 mt-1">{upload.errorMessage}</p>
                    )}
                    {upload.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {upload.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View recently uploaded images across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          {existingImages?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {existingImages.slice(0, 12).map((image: any) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">{image.title}</p>
                    <p className="text-xs text-muted-foreground">{image.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No images uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}