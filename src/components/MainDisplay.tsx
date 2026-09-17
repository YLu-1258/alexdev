import './css/MainDisplay.css';
import TabBar from './TabBar';
import { Tab } from './types';

interface MainDisplayProps {
  tabs: Tab[];
  activeTabId: string | "0";
  onActivateTab: (id: string) => void;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const MainDisplay: React.FC<MainDisplayProps> = ({
  tabs,
  setTabs,
  activeTabId,
  onActivateTab,
}) => {
  const onCloseTab = (id: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === id);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);

    if (newTabs.length > 0) {
      const nextActiveTab = newTabs[tabIndex] || newTabs[tabIndex - 1];
      if (nextActiveTab) onActivateTab(nextActiveTab.id);
    } else {
      onActivateTab("0");
    }
  };

  return (
    <div className="main-display">
      <TabBar
        tabs={tabs}
        onCloseTab={onCloseTab}
        activeTabId={activeTabId}
        onActivateTab={onActivateTab}
      />

      <div className="content">
        {tabs.find(tab => tab.id === activeTabId)?.content || (
          <div className="placeholder">
            Select a tab from below to view its contents.
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDisplay;
