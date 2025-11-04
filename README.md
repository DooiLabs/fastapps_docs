# FastApps Documentation

Official documentation for FastApps - a zero-boilerplate framework for building ChatGPT widgets.

## Overview

This documentation site is built with [Mintlify](https://mintlify.com) and covers:

- **Getting Started**: Introduction, quickstart, and project setup
- **Tutorial**: Step-by-step guide to building your first widget
- **Widgets**: Building interactive UI components with React
- **Tools**: Creating backend logic with Python
- **Core Concepts**: State management, styling, and API integration
- **Authentication**: OAuth 2.0 integration with various providers
- **API Reference**: Complete API documentation

## Structure

```
docs/
├── what-is-fastapps/    # Architecture and core concepts
├── introduction/        # Framework introduction
├── quickstart/          # 5-minute getting started guide
├── project-setup/       # Project structure and configuration
├── tutorial/            # Step-by-step tutorial
├── widgets/             # Widget development guides
├── tools/               # Tool development guides
├── state/               # State management
├── styling/             # Styling widgets
├── api-integration/     # External API integration
├── auth/                # Authentication setup
└── api-reference/       # API documentation
```

## Local Development

To preview this documentation locally:

```bash
# Install Mintlify CLI
npm i -g mintlify

# Preview docs
mintlify dev
```

The documentation will be available at `http://localhost:3000`.

## Contributing

To contribute to the documentation:

1. Edit the relevant `.mdx` files in the `docs/` directory
2. Update `docs.json` if adding new pages or changing navigation
3. Test your changes with `mintlify dev`
4. Submit a pull request

## Links

- [FastApps GitHub](https://github.com/DooiLabs/FastApps)
- [FastApps PyPI Package](https://pypi.org/project/fastapps/)
- [Community Discord](https://discord.gg/x83WSGpg)

## License

See [LICENSE](./LICENSE) file for details.
