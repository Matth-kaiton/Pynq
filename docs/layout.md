# Layout Documentation

## Overview

This document provides an overview of the layout structure used in the Pynq application.

## Folder Structure

The layout of the application is organized into several key folders:

- `app`: Contains the main application code (pages).
- `app/(tabs)`: Contains the different screens of the application (navigation bar).
- `components`: Contains reusable UI components.
- `constants`: Contains constant values used throughout the application.
- `hooks`: Contains custom hooks for reusing logic.
- `styles`: Contains global styles and theming.
- `services`: Contains services for API calls and data management.

## Navigation

The application uses a tab-based navigation structure, with the following main tabs:

- Calendar

Each tab corresponds to a different screen in the application.

## Routing

The application uses Expo Router for navigation. Each screen is defined in the `app/(tabs)` folder, and navigation between screens is handled using the `router` object from `expo-router`.

You can redirect to a page using its name, for example:

```typescript
router.replace('/calendar');
```

You can also redirect to a folder using its name, for example:

```typescript
router.replace('/(tabs)');
```

The tabs folder needs a `index.tsx` file and a `_layout.tsx` file to work properly.

Layout example:

```typescript
return (
    <Tabs> // navigation bar
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen // navigation button
        name="index" // name of the file to open when clicking the button
        options={{
          title: 'Home', // name of the button
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, // icon of the button
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
```
