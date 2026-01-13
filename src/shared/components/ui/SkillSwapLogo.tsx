export const SkillSwapLogo = ({ className = "" }) => {
    return (
        <svg
            viewBox="0 0 400 120"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="SkillSwap logo"
            className={className}
        >
            {/* ICON */}
            <g transform="translate(20,20)">
                {/* Arrow top */}
                <path
                    d="
            M40 0
            A40 40 0 0 1 80 40
            L66 40
            L88 62
            L110 40
            L96 40
            A56 56 0 0 0 40 -16
            Z
          "
                    className="fill-cyan-400 dark:fill-teal-400"
                />

                {/* Arrow bottom */}
                <path
                    d="
            M80 120
            A40 40 0 0 1 40 80
            L54 80
            L32 58
            L10 80
            L24 80
            A56 56 0 0 0 80 136
            Z
          "
                    transform="translate(0,-40)"
                    className="fill-teal-600"
                />
            </g>

            {/* WORDMARK */}
            <text
                x="160"
                y="78"
                className="fill-slate-900 dark:fill-slate-200 font-semibold"
                style={{
                    fontFamily:
                        "Inter, Poppins, system-ui, -apple-system, sans-serif",
                    fontSize: "48px",
                    letterSpacing: "-0.5px",
                }}
            >
                Skill
                <tspan className="fill-teal-600">Swap</tspan>
            </text>
        </svg>
    );
}
