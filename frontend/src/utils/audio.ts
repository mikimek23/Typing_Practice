export type SoundTheme = 'mechanical' | 'thock' | 'typewriter' | 'mute'

const SOUND_THEME_STORAGE_KEY = 'typingpro_sound_theme'
const SOUND_VOLUME_STORAGE_KEY = 'typingpro_sound_volume'

class TypingAudioEngine {
  private ctx: AudioContext | null = null
  private currentTheme: SoundTheme = 'mechanical'
  private volume = 0.4
  private isMuted = false

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = window.localStorage.getItem(SOUND_THEME_STORAGE_KEY)
        if (
          storedTheme === 'mechanical' ||
          storedTheme === 'thock' ||
          storedTheme === 'typewriter' ||
          storedTheme === 'mute'
        ) {
          this.currentTheme = storedTheme
          if (storedTheme === 'mute') this.isMuted = true
        }

        const storedVol = window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY)
        if (storedVol !== null) {
          const parsed = parseFloat(storedVol)
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed
          }
        }
      } catch {
        // Ignore local storage errors
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
  }

  public getTheme(): SoundTheme {
    return this.currentTheme
  }

  public setTheme(theme: SoundTheme) {
    this.currentTheme = theme
    this.isMuted = theme === 'mute'
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SOUND_THEME_STORAGE_KEY, theme)
      } catch {
        // Ignore
      }
    }
  }

  public getVolume(): number {
    return this.volume
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          SOUND_VOLUME_STORAGE_KEY,
          this.volume.toString(),
        )
      } catch {
        // Ignore
      }
    }
  }

  public toggleMute(): boolean {
    if (this.currentTheme === 'mute') {
      this.setTheme('mechanical')
      this.isMuted = false
    } else {
      this.setTheme('mute')
      this.isMuted = true
    }
    return !this.isMuted
  }

  public playKeyClick(isSpace = false) {
    if (this.isMuted || this.currentTheme === 'mute' || this.volume <= 0) return

    try {
      this.initContext()
      if (!this.ctx) return

      const now = this.ctx.currentTime

      if (this.currentTheme === 'mechanical') {
        // High crisp tactile click
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()

        filter.type = 'highpass'
        filter.frequency.setValueAtTime(isSpace ? 400 : 800, now)

        osc.type = isSpace ? 'triangle' : 'sine'
        osc.frequency.setValueAtTime(
          isSpace ? 320 : 650 + Math.random() * 120,
          now,
        )
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04)

        gain.gain.setValueAtTime(this.volume * 0.45, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.045)
      } else if (this.currentTheme === 'thock') {
        // Deep rounded tactile thock
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(isSpace ? 350 : 500, now)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(
          isSpace ? 140 : 200 + Math.random() * 40,
          now,
        )
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.06)

        gain.gain.setValueAtTime(this.volume * 0.6, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.07)
      } else if (this.currentTheme === 'typewriter') {
        // Sharp metallic snappy strike
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(
          isSpace ? 450 : 900 + Math.random() * 200,
          now,
        )
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.035)

        gain.gain.setValueAtTime(this.volume * 0.35, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.04)
      }
    } catch {
      // AudioContext playback safety
    }
  }

  public playError() {
    if (this.isMuted || this.currentTheme === 'mute' || this.volume <= 0) return

    try {
      this.initContext()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08)

      gain.gain.setValueAtTime(this.volume * 0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.085)
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new TypingAudioEngine()
