import React, { createContext, useContext, useEffect, useState } from 'react'
import { DataProvider } from '../core/DataSource';
import { chooseIfNotUndefined } from '../utils';

import ENLocalization from '../localization/en.json';

const RebexDataContext = createContext({});

export default RebexDataContext;

export function useRebexData() {
  return useContext(RebexDataContext);
}

const DefaultBreakpoints = {
  mobile: { max: 800 },
  desktop: { min: 1024 }
}

export function RebexDataProvider(props) {
  const localization = props.localization || ENLocalization;
  const breakpoints = props.breakpoints || DefaultBreakpoints;
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {

    const handleResize = () => {
      var currentBreakpoint = breakpoint;
      var newBreakpoint = null;
      for (var key in breakpoints) {
        var min = breakpoints[key].min;
        var max = breakpoints[key].max;
        if (min) {
          if (max) {
            if (window.innerWidth >= min && window.innerWidth < max) {
              newBreakpoint = key;
              break;
            }
          }
          else {
            if (window.innerWidth >= min) {
              newBreakpoint = key;
              break;
            }
          }
        }
        else {
          if (max) {
            if (window.innerWidth < max) {
              newBreakpoint = key;
              break;
            }
          }
        }
      }
      if (!newBreakpoint) newBreakpoint = 'desktop';
      console.log('newBreakpoint', newBreakpoint, currentBreakpoint);
      if (newBreakpoint != currentBreakpoint) {
        setBreakpoint(newBreakpoint);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  return (
    <RebexDataContext.Provider value={{
      provider: chooseIfNotUndefined(props.provider, new DataProvider()),
      localization: localization,
      breakpoint: breakpoint,
      isMobile: breakpoint === 'mobile',
      isDesktop: breakpoint === 'desktop',
      translate: ((key) => {
        return localization[key] || key;
      })
    }}>
      {props.children}
    </RebexDataContext.Provider>
  )
}