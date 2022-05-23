import AnalyticsIcon from "../public/icons/analytics.svg";
import BillingIcon from "../public/icons/billing.svg";
import TaskTrackerIcon from "../public/icons/task-tracker.svg";
import ShuffleIcon from "../public/icons/task-tracker.svg";

const iconMap = {
  analytics: AnalyticsIcon,
  billing: BillingIcon,
  'task-tracker': TaskTrackerIcon,
  shuffle: ShuffleIcon
}

export default function Icon({ glyph, ...props }) {
  const IconGlyph = iconMap[glyph];

  return <IconGlyph {...props} />
}