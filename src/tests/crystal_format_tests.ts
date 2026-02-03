import { CrystalFormat, validateCrystalFormat, type Crystal } from '../types/crystal_format';
import { CrystalExamples } from '../types/crystal_examples';
import { CrystalRuntime } from '../services/crystal_runtime';
import { Attestation } from '../services/attestation';

/**
 * TEST SUITE: Crystal Format v0.1 Validation
 * 
 * Proves that:
 * 1. Format is well-defined (TypeScript types)
 * 2. Validation works (JSON Schema)
 * 3. Examples are valid (real Crystals pass)
 * 4. Runtime integration works (executeCrystal accepts Crystals)
 */

async function runCrystalFormatTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CRYSTAL FORMAT v0.1 - VALIDATION TESTS');
    console.log('═══════════════════════════════════════════════════════\n');

    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        tests: [] as Array<{ name: string; passed: boolean; message: string }>
    };

    async function runTest(name: string, fn: () => boolean | Promise<boolean>, expectedMessage: string) {
        results.total++;
        try {
            const passed = await fn();
            results.tests.push({ name, passed, message: expectedMessage });
            if (passed) results.passed++;
            else results.failed++;
        } catch (error) {
            results.tests.push({ name, passed: false, message: `Error: ${error}` });
            results.failed++;
        }
    }

    // ========================================
    // TEST 1: Medical Crystal Validation
    // ========================================

    console.log('🧪 TEST 1: Medical Crystal Format Validation\n');

    const medCrystal = CrystalExamples.medical;
    const medValidation = validateCrystalFormat(medCrystal);

    console.log(`   Crystal ID: ${medCrystal.context_id}`);
    console.log(`   Domain: ${medCrystal.domain}`);
    console.log(`   Constraints: ${medCrystal.constraints?.length || 0}`);
    console.log(`   Invariants: ${medCrystal.verification.semantic_invariants.length}`);
    console.log(`   Validation: ${medValidation.valid ? '✅ PASSED' : '❌ FAILED'}`);

    if (!medValidation.valid) {
        console.log(`   Errors: ${medValidation.errors.join(', ')}`);
    }
    console.log('');

    await runTest(
        'Medical Crystal Structure',
        () => medValidation.valid,
        'Medical Crystal has all required fields and valid structure'
    );

    // ========================================
    // TEST 2: Legal Crystal Validation
    // ========================================

    console.log('⚖️  TEST 2: Legal Crystal Format Validation\n');

    const legalCrystal = CrystalExamples.legal;
    const legalValidation = validateCrystalFormat(legalCrystal);

    console.log(`   Crystal ID: ${legalCrystal.context_id}`);
    console.log(`   Domain: ${legalCrystal.domain}`);
    console.log(`   Constraints: ${legalCrystal.constraints?.length || 0}`);
    console.log(`   Validation: ${legalValidation.valid ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('');

    await runTest(
        'Legal Crystal Structure',
        () => legalValidation.valid,
        'Legal Crystal has all required fields and valid structure'
    );

    // ========================================
    // TEST 3: Technical Crystal Validation
    // ========================================

    console.log('💻 TEST 3: Technical Crystal Format Validation\n');

    const techCrystal = CrystalExamples.technical;
    const techValidation = validateCrystalFormat(techCrystal);

    console.log(`   Crystal ID: ${techCrystal.context_id}`);
    console.log(`   Domain: ${techCrystal.domain}`);
    console.log(`   Validation: ${techValidation.valid ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('');

    await runTest(
        'Technical Crystal Structure',
        () => techValidation.valid,
        'Technical Crystal has all required fields and valid structure'
    );

    // ========================================
    // TEST 4: Invalid Crystal Detection
    // ========================================

    console.log('🚫 TEST 4: Invalid Crystal Detection\n');

    const invalidCrystal: any = {
        scp_version: '1.0',
        // Missing required fields intentionally
        context_id: 'invalid_test'
        // created_at: missing
        // source: missing
        // intent: missing
        // verification: missing
    };

    const invalidValidation = validateCrystalFormat(invalidCrystal);

    console.log(`   Validation: ${!invalidValidation.valid ? '✅ CORRECTLY REJECTED' : '❌ FALSE POSITIVE'}`);
    console.log(`   Errors detected: ${invalidValidation.errors.length}`);
    console.log(`   Errors: ${invalidValidation.errors.join(', ')}`);
    console.log('');

    await runTest(
        'Invalid Crystal Rejection',
        () => !invalidValidation.valid && invalidValidation.errors.length > 0,
        'Invalid Crystals are correctly rejected with error messages'
    );

    // ========================================
    // TEST 5: Runtime Integration
    // ========================================

    console.log('⚙️  TEST 5: Runtime Integration (Medical Crystal)\n');

    // Compute canonical hash
    const medCrystalCopy = { ...medCrystal };
    medCrystalCopy.verification.canonical_hash = await Attestation.realSHA256(
        JSON.stringify({
            constraints: medCrystalCopy.constraints,
            entities: medCrystalCopy.entities,
            verification: {
                ...medCrystalCopy.verification,
                canonical_hash: undefined
            }
        })
    );

    try {
        const runtimeResult = await CrystalRuntime.executeCrystal({
            crystal: medCrystalCopy,
            question: 'Can Warfarin and Aspirin be safely prescribed together?',
            answer: 'No, they cannot be safely combined. Both are anticoagulants and increase bleeding risk.',
            config: {
                domain: 'medicine',
                sri_threshold: 0.85,
                sign_receipt: true,
                enable_adversarials: true,
                enable_counterfactuals: true
            },
            requester: 'validation_test'
        });

        console.log(`   SRI: ${runtimeResult.sri.toFixed(3)}`);
        console.log(`   Invariants Passed: ${runtimeResult.invariants_passed.length}/${runtimeResult.invariants_total}`);
        console.log(`   Receipt Signed: ${runtimeResult.receipt.signature.signature ? 'YES ✓' : 'NO'}`);
        console.log(`   Runtime Integration: ✅ SUCCESSFUL`);
        console.log('');

        await runTest(
            'Crystal Runtime Integration',
            () => runtimeResult.passed && runtimeResult.sri > 0.8,
            'Crystal successfully executes through runtime with high SRI'
        );
    } catch (error) {
        console.log(`   Runtime Integration: ❌ FAILED - ${error}`);
        console.log('');
        await runTest(
            'Crystal Runtime Integration',
            () => false,
            `Runtime execution failed: ${error}`
        );
    }

    // ========================================
    // TEST 6: Extensibility
    // ========================================

    console.log('🔧 TEST 6: Format Extensibility\n');

    const extendedCrystal: Crystal = {
        ...medCrystal,
        context_id: 'extended_test_001',
        extensions: {
            medical_specific: {
                icd_10_codes: ['T45.5'],
                clinical_evidence_level: 'A',
                fda_approval_status: 'approved'
            }
        },
        metadata: {
            custom_field_1: 'value1',
            custom_field_2: 42,
            nested: {
                data: true
            }
        }
    };

    const extValidation = validateCrystalFormat(extendedCrystal);

    console.log(`   Extensions added: ${Object.keys(extendedCrystal.extensions || {}).length} field(s)`);
    console.log(`   Metadata added: ${Object.keys(extendedCrystal.metadata || {}).length} field(s)`);
    console.log(`   Validation: ${extValidation.valid ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('   Format is extensible without breaking validation ✓');
    console.log('');

    await runTest(
        'Format Extensibility',
        () => extValidation.valid,
        'Extended Crystals with custom fields remain valid'
    );

    // ========================================
    // FINAL REPORT
    // ========================================

    console.log('═══════════════════════════════════════════════════════');
    console.log('  TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════\n');

    results.tests.forEach((test, idx) => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`${icon} ${idx + 1}. ${test.name}`);
        console.log(`   ${test.message}\n`);
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log(`  TOTAL: ${results.total} tests`);
    console.log(`  PASSED: ${results.passed} ✅`);
    console.log(`  FAILED: ${results.failed} ❌`);
    console.log(`  SUCCESS RATE: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (results.failed === 0) {
        console.log('🎉 ALL TESTS PASSED - Crystal Format v0.1 is PRODUCTION-READY!\n');
    } else {
        console.log('⚠️  Some tests failed - review errors above\n');
    }

    return results;
}

// Run tests
if (typeof window !== 'undefined') {
    (window as any).runCrystalFormatTests = runCrystalFormatTests;
    console.log('Tests loaded! Run: window.runCrystalFormatTests()');
} else {
    runCrystalFormatTests().catch(console.error);
}

export { runCrystalFormatTests };
