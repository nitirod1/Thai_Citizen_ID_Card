import './view.css'
export default function View() {
    return (
        <main>
            <h1 className="mb-1 font-mono text-4xl text-gray-100 md:text-6xl">
                hi, I&apos;m <br className="block md:hidden" />
                <span
                    className="inline-flex h-20 pt-2 overflow-x-hidden animate-type group-hover:animate-type-reverse whitespace-nowrap text-brand-accent will-change-transform"
                >
                    vanntile 👋
                </span>
                <span
                    className="box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor will-change-transform"
                ></span>
            </h1>
            <div className="text-xl font-semibold md:text-3xl">developer by choice and designer for fun</div>

        </main>
    )
}