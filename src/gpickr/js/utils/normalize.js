export default {

    /**
     * Converts any valid css angle value to degrees
     * @param angle
     * @returns {null|number}
     */
    angleToDegrees(angle) {
        const match = angle.trim()
            .toLowerCase()
            .match(/^(-?\d*(\.\d+)?)(deg|rad|grad|turn)$/i);

        if (!match) {
            return null;
        }

        const val = Number(match[1]);
        switch (match[3]) {
            case 'deg':
                return val;
            case 'rad':
                return (180 / Math.PI) * val;
            case 'grad':
                return (val / 400) * 360;
            case 'turn':
                return val * 360;
        }

        return null;
    }
};
