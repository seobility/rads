const fs = require("fs")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const postcssPresetEnv = require("postcss-preset-env")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const isDev = process.argv[2] !== "--env=build"

const PATHS = {
    dev: "dev",
    dist: "dist",
    twig: ["pages", "ajax"],
    // pages: path.resolve(__dirname, "dev/pages"),
    // ajaxPages: path.resolve(__dirname, "dev/ajax"),
}

const COPY_PATHS = [
    {
        from: "icons",
        to: "icons",
    },
    {
        from: "img",
        to: "img",
    },
    {
        from: "fonts",
        to: "fonts",
    },
]

fs.readdirSync(path.resolve(PATHS.dev, "ajax")).forEach((file) => {
    if (!file.endsWith(".json")) {
        return
    }

    let fileName = path.basename(file)

    COPY_PATHS.push({
        from: `ajax/${fileName}`,
        to: `ajax/${fileName}`,
    })
})

const SCRIPTS = () => {
    return createConfig({
        isDev: isDev,
        entry: "./dev/js/index.ts",
        outputFile: "./dist/js/index.min.js",
        cssFile: "../css/index.min.css",
        assetsFile: "./dev/src/assets/assets.js",
        // cssFile: `${DIST_DIR}/css/index.min.css`,
    })
}

const createConfig = ({ isDev, entry, cssFile }) => {
    let PAGES = []

    PATHS.twig.forEach((dir) => {
        let fromPath = path.resolve(__dirname, PATHS.dev, dir)

        // основные страницы компилируем в корень
        if (dir === "pages") {
            dir = ""
        }

        let toPath = path.resolve(__dirname, PATHS.dist, dir)

        if (dir.endsWith(".twig")) {
            htmlFile = toPath.replace(/\.twig$/, ".html")
            PAGES.push({
                twig: fromPath,
                html: htmlFile,
            })
            return
        }

        fs.readdirSync(fromPath).forEach((fileName) => {
            if (!fileName.endsWith(".twig")) {
                return
            }

            let htmlName = fileName.replace(/\.twig$/, ".html")

            let twigFile = path.resolve(fromPath, fileName)
            let htmlFile = path.resolve(toPath, htmlName)

            PAGES.push({
                twig: twigFile,
                html: htmlFile,
            })
        })
    })

    return {
        mode: !isDev ? "production" : "development",
        entry: {
            index: path.resolve(__dirname, entry),
        },
        output: {
            path: path.resolve(PATHS.dist, "js"),
            filename: "[name].min.js",
            clean: true,
        },
        // Кэширование сборки в файловую память а не в оперативную
        cache: isDev ? { type: "memory" /* По умолчанию 'memory */ } : false,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            // Убираем компресию кеша, для ускорения пересборки
                            cacheCompression: false,
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                            plugins: ["@babel/plugin-transform-shorthand-properties", "@babel/plugin-proposal-class-properties"],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: isDev,
                                postcssOptions: {
                                    plugins: [
                                        postcssPresetEnv({
                                            stage: 3,
                                            autoprefixer: { grid: true },
                                        }),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: isDev,
                                postcssOptions: {
                                    plugins: [
                                        postcssPresetEnv({
                                            stage: 3,
                                            autoprefixer: { grid: true },
                                        }),
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.twig$/,
                    use: [
                        "raw-loader",
                        {
                            loader: "twig-html-loader",
                            options: {
                                namespaces: {
                                    layouts: PATHS.dev,
                                    macros: path.resolve(PATHS.dev, "macros"),
                                    templateParts: path.resolve(PATHS.dev, "template-parts"),
                                    templateSections: path.resolve(PATHS.dev, "template-sections"),
                                },
                                functions: {
                                    /**
                                     * - Получает содержимое файла
                                     */
                                    getFile(src) {
                                        let file = path.resolve(PATHS.dev, src)
                                        if (fs.existsSync(file)) {
                                            return fs.readFileSync(file).toString()
                                        }
                                        return ""
                                    },
                                    getJSON(src) {
                                        let file = path.resolve(PATHS.dev, "json/" + src + ".json")
                                        let json = ""
                                        if (fs.existsSync(file)) {
                                            json = fs.readFileSync(file).toString()
                                        }
                                        return JSON.parse(json)
                                    },
                                    classNames(arr) {
                                        arr = arr.map((item) => {
                                            if (typeof item === "object") {
                                                item = Object.keys(item).map((key) => {
                                                    if (!item[key] || key === "_keys") return ""
                                                    return key
                                                })
                                                item = item.join(" ")
                                            }
                                            return item
                                        })
                                        return arr.join(" ")
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            "default",
                            {
                                discardComments: { removeAll: true },
                            },
                        ],
                    },
                }),
                new TerserPlugin(),
            ],
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: cssFile,
            }),

            new CopyWebpackPlugin({
                patterns: COPY_PATHS.map((data) => {
                    data.from = path.resolve(PATHS.dev, data.from)
                    data.to = path.resolve(PATHS.dist, data.to)
                    return data
                }),
            }),

            ...PAGES.map((sets) => {
                return new HtmlWebpackPlugin({
                    template: sets.twig,
                    filename: sets.html,
                    inject: false,
                    scriptLoading: "blocking",
                })
            }),

            // Проверка типов в фоновом процессе
            new ForkTsCheckerWebpackPlugin(),
        ],
        devtool: !isDev ? false : "source-map",
        watch: isDev,
        watchOptions: {
            ignored: ["**/node_modules", "**/dist", "**/package.json", "**/package-lock.json", "**/tsconfig.json"],
        },
        resolve: {
            extensions: [".tsx", ".jsx", ".ts", ".js", ".css", ".scss", ".png", ".svg"],
            alias: {
                Img: path.resolve(PATHS.dev, "img"),
                Svg: path.resolve(PATHS.dev, "img", "svg"),
                Js: path.resolve(PATHS.dev, "js"),
                Css: path.resolve(PATHS.dev, "css"),
            },
        },
    }
}

module.exports = SCRIPTS
