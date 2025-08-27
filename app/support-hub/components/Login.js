"use client"

import { useState } from "react"
import { signInWithGoogle } from "@/lib/auth"
import { Users, Sparkles, Zap, Shield, AlertCircle, Star, Rocket } from "lucide-react"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-center p-24 relative overflow-hidden">
      {/* Floating Elements */}
      <div
        className="absolute animate-bounce"
        style={{
          top: "80px",
          left: "80px",
          width: "32px",
          height: "32px",
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          borderRadius: "50%",
          opacity: 0.6,
        }}
      ></div>
      <div
        className="absolute animate-bounce"
        style={{
          top: "160px",
          right: "128px",
          width: "24px",
          height: "24px",
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          borderRadius: "50%",
          opacity: 0.6,
          animationDelay: "1s",
        }}
      ></div>

      <div className="container relative z-10 max-w-6xl">
        <div className="grid grid-2 gap-48" style={{ alignItems: "center" }}>
          {/* Left Side - Branding */}
          <div className="text-center fade-in">
            <div className="mb-48">
              <div
                className="flex flex-center mb-32 shadow-glow relative overflow-hidden"
                style={{
                  width: "96px",
                  height: "96px",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  borderRadius: "24px",
                  margin: "0 auto",
                }}
              >
                <Users size={48} className="text-white relative z-10" />
              </div>

              <h1 className="text-6xl font-black mb-24 text-gradient">SupportHub</h1>

              <div className="flex flex-center gap-12 mb-32">
                <Sparkles size={24} className="text-green-400 animate-pulse" />
                <p className="text-xl text-gray-300 font-medium">KIIT Student Support System</p>
                <Sparkles size={24} className="text-green-400 animate-pulse" />
              </div>

              <p className="text-lg text-gray-400 mb-32" style={{ maxWidth: "448px", margin: "0 auto 32px" }}>
                Your gateway to seamless support. Connect, collaborate, and get the help you need with our modern
                platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-2 gap-16" style={{ maxWidth: "448px", margin: "0 auto" }}>
              <div className="flex gap-12 p-16 rounded-12 glass" style={{ border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <Zap size={24} className="text-green-400" />
                <span className="text-sm font-medium text-white">Instant Support</span>
              </div>
              <div className="flex gap-12 p-16 rounded-12 glass" style={{ border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <Shield size={24} className="text-green-400" />
                <span className="text-sm font-medium text-white">Secure Access</span>
              </div>
              <div className="flex gap-12 p-16 rounded-12 glass" style={{ border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <Rocket size={24} className="text-green-400" />
                <span className="text-sm font-medium text-white">Fast Response</span>
              </div>
              <div className="flex gap-12 p-16 rounded-12 glass" style={{ border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <Star size={24} className="text-green-400" />
                <span className="text-sm font-medium text-white">Top Quality</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="slide-up">
            <div className="card max-w-md relative" style={{ margin: "0 auto" }}>
              <div
                className="absolute animate-pulse"
                style={{
                  top: "-16px",
                  right: "-16px",
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  borderRadius: "50%",
                  opacity: 0.6,
                }}
              ></div>

              <div className="text-center mb-32">
                <h2 className="text-4xl font-bold mb-16 text-gradient">Welcome Back</h2>
                <p className="text-gray-400 text-lg">Sign in with your Google account to continue</p>
              </div>

              {error && (
                <div className="alert alert-error mb-24">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn btn-google w-full mb-32 text-lg py-16"
              >
                {loading ? (
                  <div className="flex flex-center gap-12">
                    <div className="loading"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex flex-center gap-12">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </button>

              <div className="relative mb-32">
                <div className="absolute flex" style={{ top: "50%", left: 0, right: 0, transform: "translateY(-50%)" }}>
                  <div className="w-full" style={{ borderTop: "1px solid #6b7280" }}></div>
                </div>
                <div className="relative flex flex-center text-sm">
                  <span className="px-16 text-gray-400" style={{ background: "#1a1d29" }}>
                    Authorized Access Only
                  </span>
                </div>
              </div>

              <div className="glass p-24 rounded-16">
                <p className="text-sm text-gray-400 mb-16 font-medium flex gap-8">
                  <Shield size={16} className="text-green-400" />
                  Authorized for:
                </p>
                <div
                  className="text-sm text-gray-300"
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <div className="flex gap-12">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <span>KIIT Students (@kiit.ac.in)</span>
                  </div>
                  <div className="flex gap-12">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <span>Authorized Staff Members</span>
                  </div>
                  <div className="flex gap-12">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <span>Student Sub-Administrators</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-32 grid grid-4 gap-32 fade-in">
          <div className="text-center">
            <div className="text-4xl font-black text-gradient mb-8">24/7</div>
            <div className="text-gray-400 font-medium">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-gradient mb-8">20+</div>
            <div className="text-gray-400 font-medium">Sub-Administrators</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-gradient mb-8">3</div>
            <div className="text-gray-400 font-medium">Support Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-gradient mb-8">100%</div>
            <div className="text-gray-400 font-medium">Secure Platform</div>
          </div>
        </div>
      </div>
    </div>
  )
}
