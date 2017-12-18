var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const debug = process.env.NODE_DEV !== 'production';

var extractCss = new ExtractTextPlugin(debug ? 'css/[name]-[hash].css' : 'css/[name].css');

var entries = getEntry('src/js/*.js');
var chunks = Object.keys(entries);

console.log("entries------------------"+JSON.stringify(entries))

var config = {
    entry: entries,
    devtool: 'eval-source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: debug ? 'modules/[name]-[hash].js' : 'modules/[name].js',
        chunkFilename: '[id].chunk.js?[chunkhash]'
    },
    resolve: {
        alias: {
            angular: path.resolve(__dirname, 'node_modules/angular/angular.min.js'),
            'ui-router': path.resolve(__dirname, 'node_modules/angular-ui-router/release/angular-ui-router.min.js')
        }
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: extractCss.extract('style', 'css')
        }, {
            test: /\.html$/,
            loader: 'html-withimg-loader?min=false'
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=1&name=fonts/[name].[ext]'
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\d*)?$/,
            loader: 'url-loader?limit=1&name=fonts/[name].[ext]'
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?\w*)?$/,
            loader: 'url-loader?limit=1&name=fonts/[name].[ext]'
        }, {
            test: /\.(woff)$/,
            loader: 'file-loader?limit=1&name=fonts/[name].[ext]&mimetype=application/font-woff'
        }, {
            test: /\.(woff2)$/,
            loader: 'file-loader?limit=1&name=fonts/[name].[ext]&mimetype=application/font-woff'
        }, {
            test: /\.(ttf)$/,
            loader: 'file-loader?limit=1&name=fonts/[name].[ext]&mimetype=application/octet-stream'
        }, {
            test: /\.(ttf)$/,
            loader: 'file-loader?limit=1&name=fonts/[name].[ext]'
        }, {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
        }],
        resolve: {
            extensions: ['', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.eot', '.woff', '.woff2', 'ttf', '.svg'],
            modulesDirectories: [
                'node_modules'
            ]
        }
    },
    plugins: [
        // new CleanWebpackPlugin(['dist'], {
        //     root: path.resolve(__dirname),
        //     verbose: true,
        //     dry: false
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CommonsChunkPlugin({
            name: 'vendors.js',
            chunks: 'chunks',
            minChunks: chunks.length
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warning: false
            }
        }),
        extractCss
    ]
};

var pages = Object.keys(getEntry('src/*.html', '/'));
console.log(getEntry('src/*.html', 'src/'));
pages.forEach(function (pathname) {
    var conf = {
        filename: './' + pathname + '.html',
        template: './src/' + pathname + '.html'
    };
    if (pathname in config.entry) {
        conf.inject = 'body';
        conf.chunks = ['vendors.js', pathname];
        conf.hash = true;
        // conf.minify = {
        //     collapseWhitespace: true
        // };
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

// var pagesTwo = Object.keys(getEntry('src/template/*.html', '/'));
// console.log(getEntry('src/template/*.html', 'src/template/'));
// pagesTwo.forEach(function (pathname) {
//     var conf = {
//         filename: './' + pathname + '.html',
//         template: './src/template/' + pathname + '.html'
//     };
//     if (pathname in config.entry) {
//         conf.inject = 'body';
//         conf.chunks = ['app'];
//         conf.hash = true;
//         // conf.minify = {
//         //     collapseWhitespace: true
//         // };
//     }
//     config.plugins.push(new HtmlWebpackPlugin(conf));
// });

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    console.log("files---------------"+files)
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(new RegExp('^src'), '') : pathname;
        var filename = basename.substring(0, basename.indexOf('.'));
        entries[filename] = ['./' + entry];
    }

    return entries;
}

module.exports = config;
