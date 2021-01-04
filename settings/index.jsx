registerSettingsPage(props => {
    const owmKeyLength = (JSON.parse(props.settings.owm_apikey).name || '').length;
    const isValidOmwKey = !owmKeyLength || owmKeyLength === 32;

    return (
        <Page>
            <Section
                title="Weather"
                description="To enable weather conditions reporting you need to provide an API key"
            >
                {!owmKeyLength &&
                    <Text>You need an <Link source="https://openweathermap.org/api">OpenWeatherMap API key</Link> to be able to get current weather conditions</Text>}
                <TextInput
                    label="OpenWeatherMap API Key"
                    settingsKey="owm_apikey"
                    type="password"
                />
                {!isValidOmwKey &&
                    <Text italic>Warning: API key must have a length of 32 chars.</Text>}
            </Section>
        </Page>
    );
});
