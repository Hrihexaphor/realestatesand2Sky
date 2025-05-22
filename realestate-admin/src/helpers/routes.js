export function getTopLevelPermissions(routes) {
    const seenTopLevels = new Set();

    const filteredRoutes = routes.filter(route => {

        if (route.adminOnly) {
            return false;
        }
        
        const topLevel = route.path.split('/')[0];

        if (seenTopLevels.has(topLevel)) {
            return false;
        }
        seenTopLevels.add(topLevel);
        return true;
    });

    return filteredRoutes.map(route => ({
        label: route.label,
        value: route.path,
    }));
}
