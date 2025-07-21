import React from 'react';
import Icon from '../../../components/AppIcon';

const StepProgress = ({ currentStep, totalSteps, steps }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepIndex, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'current') return steps[stepIndex]?.icon || 'Circle';
    return 'Circle';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    return status === 'completed' ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium text-text-primary">
            {steps[currentStep]?.title}
          </p>
          <p className="text-xs text-text-secondary">
            {steps[currentStep]?.description}
          </p>
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex);
              const stepClasses = getStepClasses(status);
              const iconName = getStepIcon(stepIndex, status);

              return (
                <li key={step.id} className="relative flex-1">
                  <div className="flex items-center">
                    {/* Step Circle */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200 ${stepClasses}
                        `}
                      >
                        <Icon
                          name={iconName}
                          size={20}
                          className={status === 'completed' ? 'text-white' : ''}
                        />
                      </div>
                    </div>

                    {/* Connector Line */}
                    {stepIndex < steps.length - 1 && (
                      <div className="flex-1 ml-4">
                        <div
                          className={`
                            h-0.5 transition-all duration-300
                            ${getConnectorClasses(stepIndex)}
                          `}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`
                        text-sm font-medium transition-colors duration-200
                        ${status === 'current' ? 'text-primary' : 
                          status === 'completed' ? 'text-success' : 'text-text-secondary'}
                      `}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 max-w-24 mx-auto">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Progress Percentage */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;