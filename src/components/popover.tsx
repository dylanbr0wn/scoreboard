import { Popover, Transition } from "@headlessui/react";
import * as React from "react";

const CustPopover = ({ children }: { children: React.ReactNode }) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className="px-4 py-3 bg-violet-100 rounded-lg active:bg-violet-200 text-violet-800 duration-300 transition-colors ring-0 outline-none">
                        Open Board
                    </Popover.Button>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-1/2 z-10 mt-3 w-screen max-w-sm translate-x-16 transform px-4 sm:px-0">
                            {children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};
export default CustPopover;
