import React from 'react';

interface WithTourGuideProps {
  tourId: string;
}

export const withTourGuide = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { tourId }: WithTourGuideProps
) => {
  return function WithTourGuideWrapper(props: P) {
    return (
      <div data-tour={tourId}>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withTourGuide; 