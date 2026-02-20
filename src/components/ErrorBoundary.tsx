"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error) {
    console.error("[PromptVault ErrorBoundary]", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-6">
            <div className="text-4xl">⚠️</div>
            <h2 className="font-bold text-xl text-text-primary tracking-tight">
              Something went wrong
            </h2>
            <p className="text-muted text-sm max-w-sm">{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="bg-accent/8 hover:bg-accent/15 text-accent border border-accent/15 px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
