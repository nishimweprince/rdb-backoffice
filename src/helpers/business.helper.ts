import {
  NavigationFlow,
  NavigationFlowMass,
} from '@/types/models/navigationFlow';

// FIND NAVIGATION FLOW ID BY STEP NAME
export const findNavigationFlowMassIdByStepName = (
  navigationFlowMassList?: NavigationFlowMass,
  stepName?: string
) => {
  if (!navigationFlowMassList) return undefined;
  const navigationFlowId = Object?.values(navigationFlowMassList)
    ?.flat()
    ?.find((navigationFlow) => navigationFlow?.stepName === stepName)?.id;
  return navigationFlowId;
};

// FIND NAVIGATION FLOW BY STEP NAME
export const findNavigationFlowByStepName = (
  businessNavigationFlowsList?: NavigationFlow[],
  stepName?: string
) => {
  if (!businessNavigationFlowsList) return undefined;
  const navigationFlow = Object?.values(businessNavigationFlowsList)
    ?.flat()
    ?.find(
      (navigationFlow) =>
        navigationFlow?.navigationFlowMass?.stepName === stepName
    );
  return navigationFlow;
};

export const getBusinessStatusColor = (status: string): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-blue-700';
    case 'VERIFIED':
      return 'bg-green-700';
    case 'APPROVED':
    case 'ACTIVE':
      return 'bg-green-700';
    case 'REJECTED':
      return 'bg-red-700';
    case 'RESUBMITTED':
      return 'bg-yellow-700';
    case 'ACTION_REQUIRED':
      return 'bg-yellow-700';
    case 'AMENDMENT_SUBMITTED':
      return 'bg-yellow-700';
    case 'IN_REVIEW':
      return 'bg-blue-700';
    case 'PENDING_DECISION':
      return 'bg-blue-700';
    default:
      return '';
  }

}
