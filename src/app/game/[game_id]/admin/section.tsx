import { cx } from "@/utils/cx";

export const SectionHeader = ({ title, text, contentTrailing }: { title: string; text?: string; contentTrailing?: any }) => {
    return (
        <div className="flex flex-col gap-5 border-b border-none border-secondary pb-0">
            <div className="relative flex flex-col items-start gap-10 md:flex-row">
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 self-stretch">
                    <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    <p className="text-sm text-tertiary">{text}</p>
                </div>

                {contentTrailing}

                {/* <div className="absolute top-0 right-0 md:static"> */}
                {/*     <Dropdown.Root> */}
                {/*         <Dropdown.DotsButton /> */}
                {/**/}
                {/*         <Dropdown.Popover className="w-min"> */}
                {/*             <Dropdown.Menu> */}
                {/*                 <Dropdown.Item icon={Plus} onAction={() => {}}> */}
                {/*                     <span className="pr-4">Add question</span> */}
                {/*                 </Dropdown.Item> */}
                {/*                 <Dropdown.Item icon={Trash01} onAction={() => {}}> */}
                {/*                     <span className="pr-4">Delete question</span> */}
                {/*                 </Dropdown.Item> */}
                {/*             </Dropdown.Menu> */}
                {/*         </Dropdown.Popover> */}
                {/*     </Dropdown.Root> */}
                {/* </div> */}
            </div>
        </div>
    );
};

export const Section = ({ className, children }) => {
    return (
        <div className={cx("mx-auto w-full max-w-container px-4 lg:px-8", className)}>
            <div className="mx-auto flex w-full max-w-160 flex-col gap-6">{children}</div>
        </div>
    );
};

export default Section;
