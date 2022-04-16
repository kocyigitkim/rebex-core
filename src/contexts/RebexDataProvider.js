import React, { createContext, useContext, useEffect, useState } from 'react'
import { DataProvider } from '../core/DataSource';
import { chooseIfNotUndefined } from '../utils';

import ENLocalization from '../localization/en.json';

const RebexDataContext = createContext({});

export default RebexDataContext;

export function useRebexData() {
  return useContext(RebexDataContext);
}



export function RebexDataProvider(props) {
  const localization = props.localization || ENLocalization;

  const [breakpoint, setBreakpoint] = useState();

  useEffect(() => {

    const handleResize = () => {
      var newBreakpoint = 'desktop';
      if (window.innerWidth <= 800) newBreakpoint = 'mobile';

      if (!newBreakpoint) newBreakpoint = 'desktop';
      if (newBreakpoint != breakpoint) {
        console.log('CHANGED');
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
      isDesktop: breakpoint !== 'mobile',
      translate: ((key) => {
        return localization[key] || key;
      })
    }}>
      {props.children}
    </RebexDataContext.Provider>
  )
}