"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music2, XCircle, Star, LogIn, LogOut } from "lucide-react";
import { PlaylistCard } from "./PlaylistCard";
import { toast, Toaster } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getAuthUrl,
  getAccessToken,
  fetchPlaylistDetails,
} from "@/utils/spotifyApi";

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
    id: "6ZWWbwLnpN1yppD9mpn6sZ",
    name: "Lofi programing",
    description: "Best lofi for programers!!!",
    imageUrl:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c121e705ed7aa76c97e9aa326",
  },
  {
    id: "1d2VcwJ1UQc3s46KqLrCQP",
    name: "Work Music 2024",
    description:
      "Working &amp; Chill - Office Hits - Clean For Work Playlist music for Work Music Focus Music for working from home work playlist 2024 clean work songs working and chill Office Music 2024 Office Playlist 2024 workplace jams",
    imageUrl:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84ec720320eefdd98ec54c6e30",
  },
  {
    id: "1Vi7vReqfgQRoLrEsnR0KO",
    name: "Coders' Playlist",
    description: "Tune in with GeeksforGeeks.",
    imageUrl:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c00c781ab4573a49f699a7e91",
  },
];

export function SpotifyWidget() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setAccessToken(token);
    }

    const saved = localStorage.getItem("savedPlaylists");
    if (saved) {
      setSavedPlaylists(JSON.parse(saved));
    }
  }, []);

  const handleAuth = () => {
    window.location.href = getAuthUrl();
  };

  const handleSignOut = () => {
    localStorage.removeItem("spotifyAccessToken");
    setAccessToken(null);
    toast.success("Signed out of Spotify successfully");
  };

  const savePlaylist = async (playlist: Playlist) => {
    if (!accessToken) {
      toast.error("Please sign in to Spotify to save playlists.");
      return;
    }

    setIsLoading(true);
    try {
      const playlistDetails = await fetchPlaylistDetails(
        playlist.id,
        accessToken
      );
      const updatedPlaylists = [...savedPlaylists, playlistDetails];
      setSavedPlaylists(updatedPlaylists);
      localStorage.setItem("savedPlaylists", JSON.stringify(updatedPlaylists));
      toast.success("Playlist saved successfully!");
    } catch (error) {
      console.error("Error saving playlist:", error);
      toast.error("Failed to save playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removePlaylist = (id: string) => {
    const updatedPlaylists = savedPlaylists.filter(
      (playlist) => playlist.id !== id
    );
    setSavedPlaylists(updatedPlaylists);
    localStorage.setItem("savedPlaylists", JSON.stringify(updatedPlaylists));
    toast.success("Playlist removed from library.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistUrl) {
      const playlistId = playlistUrl.split("/playlist/")[1]?.split("?")[0];
      if (playlistId) {
        setIsLoading(true);
        try {
          setEmbedUrl(
            `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=oembed`
          );
          if (accessToken) {
            const playlistDetails = await fetchPlaylistDetails(
              playlistId,
              accessToken
            );
            setCurrentPlaylist(playlistDetails);
          }
        } catch (error) {
          console.error("Error fetching playlist:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error("Invalid Spotify playlist URL. Please try again.");
      }
    }
  };

  const handleSelectPlaylist = async (playlist: Playlist) => {
    setIsLoading(true);
    try {
      setEmbedUrl(
        `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=oembed`
      );
      setCurrentPlaylist(playlist);
      if (accessToken) {
        const playlistDetails = await fetchPlaylistDetails(
          playlist.id,
          accessToken
        );
        setCurrentPlaylist(playlistDetails);
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
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
      <h2 className="text-2xl font-semibold text-gray-100 mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <Music2 className="w-6 h-6 mr-2 text-green-400" />
          Spotify Playlists
        </span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              {accessToken ? (
                <Button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleAuth}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                >
                  Sign in to Spotify
                  <LogIn className="w-4 h-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {accessToken ? "Sign out of Spotify" : "Sign in to Spotify"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : !embedUrl ? (
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
            {accessToken && (
              <>
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
              </>
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
            {accessToken &&
              currentPlaylist &&
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
