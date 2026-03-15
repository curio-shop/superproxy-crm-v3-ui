# Voice Preview - Prototype UI/UX

## What This Does

The voice preview feature demonstrates the UI/UX for voice selection without requiring actual audio files. Perfect for prototyping and demos.

## How It Works

1. **Click "Preview"** → Button changes to "Playing..." with purple background and pause icon
2. **Wait 4 seconds** → Automatically returns to "Preview" state
3. **Click "Playing..."** → Manually stops the simulated playback
4. **Switch voices** → Previous voice stops, new one starts playing
5. **Change tabs** → Automatically stops any playing preview

## Visual States

### Default State
- **Text**: "Preview"
- **Icon**: Play icon (solar:play-circle-linear)
- **Color**: Purple text (text-purple-600)
- **Hover**: Light purple background

### Playing State
- **Text**: "Playing..."
- **Icon**: Pause icon (solar:pause-circle-bold)
- **Background**: Purple (bg-purple-100)
- **Border**: Purple border (border-purple-200)
- **Duration**: 4 seconds (simulated)

## Implementation Notes

- No actual audio files required
- Uses setTimeout for simulated playback
- Cleanup on tab change prevents orphaned timers
- Click to stop playback early
- Only one voice plays at a time

## Perfect For

✅ Client/stakeholder demos  
✅ Design reviews  
✅ UX testing  
✅ Prototyping sessions  
✅ Before ElevenLabs API integration  

---

*When ready for production, replace the timeout logic with actual ElevenLabs API audio playback.*
