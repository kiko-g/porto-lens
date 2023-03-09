import React, { useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useDarkMode } from 'usehooks-ts';
import classNames from 'classnames';

type Props = {
  large?: boolean;
};

export default function DarkModeSwitch({ large }: Props) {
  const { isDarkMode, toggle } = useDarkMode();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const className = 'dark';
      const bodyClass = window.document.body.classList;
      isDarkMode ? bodyClass.add(className) : bodyClass.remove(className);
    }
  }, [isDarkMode]);

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          title="Toggle Dark Mode"
          aria-label="Toggle Dark Mode"
          checked={isDarkMode}
          onClick={() => toggle()}
          className={`${isDarkMode ? 'animate-dark' : 'animate-light'} rounded-full p-0 md:p-[4px]`}
        >
          {isDarkMode ? (
            <MoonIcon
              aria-hidden="true"
              className={classNames(
                large ? 'h-7 w-7 md:h-9 md:w-9' : 'h-6 w-6 md:h-8 md:w-8',
                `ease block text-slate-400 transition duration-150 hover:text-slate-400/80 `
              )}
            />
          ) : (
            <SunIcon
              aria-hidden="true"
              className={classNames(
                large ? 'h-7 w-7 md:h-9 md:w-9' : 'h-6 w-6 md:h-8 md:w-8',
                `ease block text-orange-400 transition duration-150 hover:text-orange-400/80 `
              )}
            />
          )}
        </Switch>
      </div>
    </Switch.Group>
  );
}
