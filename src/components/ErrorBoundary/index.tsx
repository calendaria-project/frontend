import React from 'react';

export interface IErrorBoundaryState {
    hasError: boolean;
    error: Error;
}

export interface IErrorBoundaryProps {
    children: React.ReactNode
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    state = {
        hasError: false,
        error: {} as Error,
    };

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({
            hasError: true,
            error,
        });
    }

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div>
                Произошла ошибка при загрузке страницы, пожалуйста, обратитесь в центр поддержки
            </div>
        );
    }
}

export default ErrorBoundary;
