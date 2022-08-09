import React from "react";
import { render } from "@testing-library/react";
import App from './App';


test('renders event list items with avatar', async () => {
  const renderedComponent = await render(
    <App />
  );
}, 220_000);
