import { createRoot } from 'react-dom/client';
import SettingsPage from './SettingsPage';

import './style.css';

const rootElement = document.querySelector('#ctp-settings-page') as HTMLElement;

const root = createRoot(rootElement);
root.render(<SettingsPage />)
