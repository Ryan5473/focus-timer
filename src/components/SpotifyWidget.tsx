"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music2, XCircle, Star } from "lucide-react";
import { PlaylistCard } from "./PlaylistCard";
import { toast, Toaster } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const defaultPlaylists: Playlist[] = [
  {
    id: "37i9dQZF1DXcBWIGoYBM5M",
    name: "Today's Top Hits",
    description: "The most popular tracks on Spotify right now.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002190f3b4e21c6f7b6b995e435",
  },
  {
    id: "37i9dQZEVXbMDoHDwVN2tF",
    name: "Global Top 50",
    description: "The most played tracks worldwide.",
    imageUrl:
      "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_large.jpg",
  },
  {
    id: "37i9dQZF1DX0XUsuxWHRQd",
    name: "RapCaviar",
    description: "New music from Lil Baby, Polo G and Lil Durk.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f000000025c33e0d3af9ab2bfcb5a1a89",
  },
  {
    id: "37i9dQZF1DX4JAvHpjipBk",
    name: "New Music Friday",
    description: "The best new music of the week.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f0000000254473de875fea0fd19d39037",
  },
  {
    id: "37i9dQZF1DWXRqgorJj26U",
    name: "Rock Classics",
    description:
      "Rock legends & epic songs that continue to inspire generations.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730",
  },
  {
    id: "37i9dQZF1DX4o1oenSJRJd",
    name: "All Out 00s",
    description: "The biggest songs of the 2000s.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002f2c97ea8a8bfbd06c4906eea",
  },
  {
    id: "37i9dQZF1DX1lVhptIYRda",
    name: "Hot Hits UK",
    description: "The hottest tracks in the United Kingdom.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f000000025f5afb557c431a5f6163c5c9",
  },
  {
    id: "37i9dQZF1DX0kbJZpiYdZl",
    name: "Hot Hits USA",
    description: "The hottest tracks in the United States.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002942b5a04176d40ae8f472ca6",
  },
];

const foundersPicks: Playlist[] = [
  {
    id: "37i9dQZF1DX5KpP2LN299J",
    name: "Lo-Fi Beats",
    description: "Beats to relax, study, and focus.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
  },
  {
    id: "37i9dQZF1DX8NTLI2TtZa6",
    name: "Coding Mode",
    description: "Dedicated to all the programmers out there.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f000000025551996f500ba876bda73fa5",
  },
  {
    id: "37i9dQZF1DWZeKCadgRdKQ",
    name: "Deep Focus",
    description: "Keep calm and focus with ambient and post-rock music.",
    imageUrl:
      "https://i.scdn.co/image/ab67706f00000002d6d48b11fd3b11da654c3519",
  },
];

export function SpotifyWidget() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("savedPlaylists");
    if (saved) {
      setSavedPlaylists(JSON.parse(saved));
    }
  }, []);

  const showSignInToast = () => {
    if (!toastShown) {
      toast(
        <div>
          Sign in to Spotify for full functionality.
          <a
            href="https://accounts.spotify.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-green-400 hover:text-green-300 underline"
          >
            Sign in to Spotify
          </a>
        </div>,
        {
          duration: 5000,
        }
      );
      setToastShown(true);
    }
  };

  const savePlaylist = (playlist: Playlist) => {
    showSignInToast();
    const updatedPlaylists = [...savedPlaylists, playlist];
    setSavedPlaylists(updatedPlaylists);
    localStorage.setItem("savedPlaylists", JSON.stringify(updatedPlaylists));
  };

  const removePlaylist = (id: string) => {
    showSignInToast();
    const updatedPlaylists = savedPlaylists.filter(
      (playlist) => playlist.id !== id
    );
    setSavedPlaylists(updatedPlaylists);
    localStorage.setItem("savedPlaylists", JSON.stringify(updatedPlaylists));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSignInToast();
    if (playlistUrl) {
      const playlistId = playlistUrl.split("/playlist/")[1]?.split("?")[0];
      if (playlistId) {
        const newPlaylist: Playlist = {
          id: playlistId,
          name: "Custom Playlist",
          description: "Your custom playlist",
          imageUrl: "https://via.placeholder.com/300",
        };
        setCurrentPlaylist(newPlaylist);
        setEmbedUrl(
          `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=oembed`
        );
      } else {
        toast.error("Invalid Spotify playlist URL. Please try again.");
      }
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    showSignInToast();
    setCurrentPlaylist(playlist);
    setEmbedUrl(
      `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=oembed`
    );
  };

  return (
    <div className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700 h-[32rem] flex flex-col">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
          },
        }}
      />
      <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center">
        <Music2 className="w-6 h-6 mr-2 text-green-400" />
        Spotify Playlists
      </h2>
      {!embedUrl ? (
        <>
          <div className="mb-4 overflow-y-auto flex-grow pr-2">
            <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
              Founder&apos;s Picks
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {foundersPicks.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  {...playlist}
                  onSelect={() => handleSelectPlaylist(playlist)}
                  onSave={() => savePlaylist(playlist)}
                  isSaved={savedPlaylists.some((p) => p.id === playlist.id)}
                />
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Your Playlists
            </h3>
            {savedPlaylists.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {savedPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    {...playlist}
                    onSelect={() => handleSelectPlaylist(playlist)}
                    onRemove={() => removePlaylist(playlist.id)}
                    isSaved
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mb-4">No saved playlists yet.</p>
            )}
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Recommended Playlists
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {defaultPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  {...playlist}
                  onSelect={() => handleSelectPlaylist(playlist)}
                  onSave={() => savePlaylist(playlist)}
                  isSaved={savedPlaylists.some((p) => p.id === playlist.id)}
                />
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Or paste your Spotify playlist URL"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="flex-grow bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
            />
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center gap-2"
            >
              <Music2 className="w-4 h-4" />
              Load
            </Button>
          </form>
        </>
      ) : (
        <div className="relative flex-grow">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden"
            allow="encrypted-media"
            title="Spotify Playlist"
          ></iframe>
          <div className="absolute top-2 left-2 flex gap-2 z-10">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-900/80 hover:bg-gray-800/90 text-gray-400 hover:text-white transition-colors"
                    onClick={() => {
                      setEmbedUrl("");
                      setCurrentPlaylist(null);
                    }}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close player</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {currentPlaylist &&
              !savedPlaylists.some((p) => p.id === currentPlaylist.id) && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-gray-900/80 hover:bg-gray-800/90 text-gray-400 hover:text-green-400 transition-colors"
                        onClick={() => savePlaylist(currentPlaylist)}
                      >
                        <Music2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save to library</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
