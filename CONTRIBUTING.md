感谢您有兴趣为 gdbgui 做出贡献！

如果您的更改很小，请继续提交拉取请求。 如果它很重要，请在进行更改之前创建一个 GitHub 问题来讨论它。

## 依赖关系

1.) [nox](https://github.com/theacodes/nox) 用于自动化各种任务。 在继续之前，您需要在系统上安装它。

您可以使用 pipx 安装它（推荐）：
```
> pipx install nox
```
或者 pip:
```
> pip install --user nox
```

2.) [yarn](https://yarnpkg.com/) 用于管理 JavaScript 文件

## 开发
只需一个简单的步骤即可完成开发：
```
> nox -s develop
```
这将安装所有 Python 和 JavaScript 依赖项，并构建和监视 Python 和 JavaScript 文件的更改，并在发生更改时自动重新加载。

确保您[关闭缓存](https://www.technipages.com/google-chrome-how-to-completely-disable-cache)，以便在页面中反映本地所做的更改。

## 运行和添加测试
```bash
> nox
```

运行所有适用的测试和 linting。

Python 测试在 `gdbgui/tests`. 它们作为上述命令的一部分运行，但可以使用
```
> nox -s python_tests
```

JavaScript 测试在 `gdbgui/src/js/tests`. 它们作为上述命令的一部分运行，但可以使用
```
> nox -s js_tests
```

## 文档

### 修改文档
文档是用 `mkdocs` 制作的。 然后对 `docs` 目录中的 `mkdocs.yml` 或 md 文件进行更改。

要构建文档，请运行
```
nox -s docs
```

要查看当前文档的实时预览，请运行
```
nox -s watch_docs
```

### 发布文档
生成的文档发布到 `gh-pages` 分支。
```
nox -s publish_docs
```

### 构建二进制可执行文件

这些是在 CI 上自动构建的，但可以使用相应的 `nox` 命令在本地构建，例如：

```
nox -s build_executable_current_platform
```

## 发布新版本
1. 确保版本号在 `VERSION.txt` 中递增。
1. 要发布的版本必须在 master 分支上，并且所有 CI 测试都通过，并且新的二进制可执行工件附加到 GitHub 操作结果
1. 将包发布到 PyPI 并更新文档。 两者都是用这个 `nox -s publish` 完成的。
1. 在 GitHub 中创建一个“发布”并将 gdbgui 二进制可执行文件附加到它。

