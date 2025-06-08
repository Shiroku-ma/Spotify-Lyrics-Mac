tell application "Spotify"
    if player state is playing then
        return "playing"
    else
        return "paused"
    end if
end tell