# Background

### Modules

Modern JavaScript code is often organized into modules. Each module specifies a namespace and enforces access controls on which parts of that code can be used outside of the module.

A program may have all of its code in a single module, or it may import other modules as dependencies.

### Dependencies

A target file’s dependencies are also modules. A dependency is imported by specifying a relative or absolute URL to the source of the module within the import statement. A dependency can have its own dependencies, each of which can also have dependencies, forming a dependency graph. The bundler loads and builds everything that is needed to satisfy the entire dependency graph.

### Bundlers

A bundler groups an entry file with all its dependencies into a single bundle object which can be linked within a regular script tag.

```js
<script src="bundle.js"></script>
```

Among the benefits of using a bunler is transmitting less files over the network. Often bundlers also do optimization work on the bundle such as minification, uglification, etc.
