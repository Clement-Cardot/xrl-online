package fr.eseo.pfe.xrlonline.service.reports;

import java.io.InputStream;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import org.springframework.stereotype.Service;

@Service
public class ReportTranslationService {
    
    @SuppressWarnings("unchecked")
    public Map<String, String> getTranslations(String lang) throws CustomRuntimeException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> i18n;
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("assets/i18n/project-report/" + lang.toLowerCase() + ".json");
            i18n = objectMapper.readValue(is, Map.class);
        } catch (Exception e) {
            try {
                InputStream is = getClass().getClassLoader().getResourceAsStream("assets/i18n/project-report/en.json");
                i18n = objectMapper.readValue(is, Map.class);
            } catch (Exception e1) {
                throw new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR, e1);
            }
        }
        return i18n;
    }
}
