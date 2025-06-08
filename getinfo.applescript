tell application "Spotify"
	set currentTrack to name of current track
	set currentArtist to artist of current track
	
	set pos to player position
	return currentTrack & "/" & currentArtist & "/" & pos
end tell