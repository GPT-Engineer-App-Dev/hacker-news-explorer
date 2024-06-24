import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function Index() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchTerm, stories]);

  const fetchTopStories = async () => {
    try {
      const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const top5StoryIds = topStoryIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
      const stories = await Promise.all(storyPromises);
      setStories(stories.map(story => story.data));
      setFilteredStories(stories.map(story => story.data));
    } catch (error) {
      console.error('Error fetching top stories:', error);
    }
  };

  const filterStories = () => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2"
          />
          <div className="flex items-center ml-4">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        <div className="grid gap-4">
          {filteredStories.map(story => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Upvotes: {story.score}</p>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Read more</a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;