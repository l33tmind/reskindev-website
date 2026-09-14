import wave
import math
import struct

# Parameters
framerate = 44100
duration = 0.15 # seconds
frequency = 800.0
volume = 16000.0

# Open a new wave file
wav_file = wave.open("public/notification.wav", "w")

# Set parameters
nchannels = 1
sampwidth = 2
nframes = int(framerate * duration)
comptype = "NONE"
compname = "not compressed"
wav_file.setparams((nchannels, sampwidth, framerate, nframes, comptype, compname))

# Generate the sound (sine wave)
for i in range(nframes):
    # Envelope: quick attack, slow release
    t = float(i) / framerate
    env = math.exp(-t * 15) 
    
    value = int(volume * env * math.sin(2.0 * math.pi * frequency * t))
    data = struct.pack("<h", value)
    wav_file.writeframesraw(data)

wav_file.close()
print("Generated notification.wav")
