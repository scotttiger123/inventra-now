
// NavigationService.js
import { NavigationContainerRef } from '@react-navigation/native';

let navigationRef = null;

export function setNavigationRef(ref) {
  navigationRef = ref;
}

export function isReady() {
  return navigationRef !== null;
}

export function navigate(name, params) {
  if (navigationRef && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}
